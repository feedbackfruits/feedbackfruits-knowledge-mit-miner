import { Observable, Observer } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import fetch from 'node-fetch';
import { S3 } from 'aws-sdk';

import PQueue from 'p-queue';
import * as striptags from 'striptags';

import { Captions } from 'feedbackfruits-knowledge-engine';
import * as Doc from './doc';
import * as Config from './config';

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = Config;
const s3 = new S3({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY });
const s3Queue = new PQueue({ concurrency: 100 });
const mitQueue = new PQueue({ concurrency: 2 });

const getCourseIds = (count = Infinity, marker: string = null): Observable<string> => {
  return Observable.create(async (observer: Observer<string>) => {
    const results = await new Promise<Array<string>>((resolve, reject) => {
      console.log('Getting course ids...')
      s3.listObjects({ Bucket: S3_BUCKET, Delimiter: '/', Marker: marker, MaxKeys: Math.min(count, 100) }, (err, data) => {
        console.log('Course ids:', err, data);
        if (err) return reject(err);
        resolve(data.CommonPrefixes.map(c => c.Prefix));
      });
    });

    results.slice(0, Math.min(count, results.length)).forEach(result => observer.next(result));
    if (results.length) getCourseIds(count - results.length, results[results.length - 1]).subscribe(observer);
  });
};

const getCourseInfo = async (courseId: string): Promise<object> => {
  const key = await new Promise<string>((resolve, reject) => {
    s3.listObjects({ Bucket: S3_BUCKET, Prefix: courseId }, (err, data) => {
      if (err) return reject(err);
      resolve(data.Contents.find(object => object.Key.endsWith('_master.json')).Key);
    });
  });

  const info = await new Promise((resolve, reject) => {
    s3.getObject({ Bucket: S3_BUCKET, Key: key }, (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data.Body.toString()));
    });
  });

  return info as any;
};

const makeCourseDocs = async (courseInfo: object): Promise<Array<object>> => {
  const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
  const courseKeywords = courseInfo["tags"].map(tag => {
    return tag.name;
  });
  const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';

  if ((await mitQueue.add(() => fetch(courseUrl, { method: 'HEAD' }))).status == 404) return [];

  const departmentUrl = courseUrl.match(/(.*)\/.*$/)[1];
  const courseName = courseInfo['title'];
  const courseDescription = striptags(courseInfo['description']);
  const coursePagesIndex = courseInfo['course_pages'].reduce((memo, coursePageInfo) => {
    const { uid } = coursePageInfo;
    return {
      ...memo,
      [uid]: coursePageInfo
    };
  }, {});

  const documents = courseInfo['course_files'].filter(fileInfo => fileInfo['file_type'] === 'application/pdf' && fileInfo['title'] != null && fileInfo['title'] != '3play pdf file' && fileInfo['title'].indexOf(' ') == -1 && fileInfo['parent_uid'] in coursePagesIndex).map(fileInfo => {
    return Doc.fileToDoc(fileInfo, courseInfo, coursePagesIndex);
  });

  const videos = await Promise.all(Object.values(courseInfo['course_embedded_media']).filter(mediaInfo => mediaInfo['embedded_media'].some(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream')).map(async mediaInfo => {
    const youtubeSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream');
    const youtubeId = youtubeSource['media_info']
    const captionSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === youtubeId + '.srt');
    let captionsUrl, captions = [];
    if (captionSource) {
      captionsUrl = captionSource['technical_location'];
      captions = await mitQueue.add(() => Captions.getCaptions(captionsUrl));
    }

    return Doc.videoToDoc(mediaInfo, captions, captionsUrl, courseInfo, coursePagesIndex);
  }));

  const courseDoc = {
    "@id": courseUrl,
    "@type": [
      "Topic",
      "Resource"
    ],
    name: courseName,
    description: courseDescription,
    keywords: courseKeywords,
    license: mitLicense,
    learningResourceType: 'courses',
    sourceOrganization: [
      "https://ocw.mit.edu"
    ],
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
  return getCourseIds().pipe(
    concatMap(getCourseInfo),
    concatMap(makeCourseDocs),
    concatMap(docs => docs),
  );
};
