require('dotenv').load({ silent: true });

import fetch from 'node-fetch';
import { S3 } from 'aws-sdk';
import PQueue = require('p-queue');
import * as striptags from 'striptags';
import { Observable, Observer } from '@reactivex/rxjs';

import { Doc, Captions } from 'feedbackfruits-knowledge-engine';

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
const s3 = new S3({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY });
const s3Queue = new PQueue({ concurrency: 100 });
const mitQueue = new PQueue({ concurrency: 2 });

const getCourseIds = (count = Infinity, marker: string = null): Observable<string> => {
  return Observable.create(async (observer: Observer<string>) => {
    const results = await new Promise<Array<string>>((resolve, reject) => {
      s3.listObjects({ Bucket: S3_BUCKET, Delimiter: '/', Marker: marker, MaxKeys: Math.min(count, 1000) }, (err, data) => {
        if (err) reject(err);
        resolve(data.CommonPrefixes.map(c => c.Prefix));
      });
    });

    results.slice(0, Math.min(count, results.length)).forEach(result => observer.next(result));
    getCourseIds(count - results.length, results[results.length - 1]).subscribe(observer);
  });
};

const getCourseInfo = async (courseId: string): Promise<object> => {
  const key = await new Promise<string>((resolve, reject) => {
    s3.listObjects({ Bucket: S3_BUCKET, Prefix: courseId }, (err, data) => {
      if (err) reject(err);
      resolve(data.Contents.find(object => object.Key.endsWith('_master.json')).Key);
    });
  });

  const info = await new Promise((resolve, reject) => {
    s3.getObject({ Bucket: S3_BUCKET, Key: key }, (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data.Body.toString()));
    });
  });

  return info;
};

const makeCourseDocs = async (courseInfo: object): Promise<Array<object>> => {
  const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];

  if ((await mitQueue.add(() => fetch(courseUrl, { method: 'HEAD' }))).status == 404) return [];

  const departmentUrl = courseUrl.match(/(.*)\/.*$/)[1];
  const courseName = courseInfo['title'];
  const courseDescription = striptags(courseInfo['description']);

  const documents = courseInfo['course_files'].filter(fileInfo => fileInfo['file_type'] === 'application/pdf' && fileInfo['file_location'] != null).map(fileInfo => {
    const fileName = fileInfo['title'];
    const fileDescription = fileInfo['description'];
    const fileUrl = fileInfo['file_location'];

    return {
      "@id": fileUrl,
      "@type": [
        "Resource",
        "Document"
      ],
      name: fileName,
      description: fileDescription,
      sourceOrganization: [
        "https://ocw.mit.edu"
      ],
      topic: courseUrl
    };
  });

  const videos = await Promise.all(Object.values(courseInfo['course_embedded_media']).filter(mediaInfo => mediaInfo['embedded_media'].some(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream')).map(async mediaInfo => {
    const mediaName = mediaInfo['title'];
    const youtubeSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream');
    const youtubeId = youtubeSource['media_info']
    const youtubeUrl = 'http://youtube.com/watch?v=' + youtubeSource['media_info'];
    const captionSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === youtubeId + '.srt');

    let captions = [], metadata, captionsUrl;

    if (captionSource) {
      captionsUrl = captionSource['technical_location'];
      captions = await mitQueue.add(() => Captions.getCaptions(captionsUrl));
      metadata = Captions.toMetadata(captions);
    }

    return {
      "@id": youtubeUrl,
      "@type": [
        "Resource",
        "Video"
      ],
      name: mediaName,
      sourceOrganization: [
        "https://ocw.mit.edu"
      ],
      topic: courseUrl,
      ...(captions.length ? {
        caption: [ captionsUrl ],
        contentDuration: metadata.totalDuration,
        contentLength: metadata.totalLength,
      } : {})
    };
  }));

  const courseDoc = {
    "@id": courseUrl,
    "@type": [
      "Topic",
      "Resource"
    ],
    name: courseName,
    description: courseDescription,
    parent: {
      "@id": departmentUrl,
      "@type": [
        "Topic"
      ],
      child: [
        courseUrl
      ]
    },
    child: [ ...documents, ...videos ]
  };

  return [courseDoc];
};

export const mine = (): Observable<object> => {
  return getCourseIds()
    .flatMap(getCourseInfo)
    .flatMap(makeCourseDocs)
    .flatMap(docs => docs)
};
