"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const node_fetch_1 = require("node-fetch");
const aws_sdk_1 = require("aws-sdk");
const p_queue_1 = require("p-queue");
const striptags = require("striptags");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const Doc = require("./doc");
const Config = require("./config");
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = Config;
const s3 = new aws_sdk_1.S3({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY });
const s3Queue = new p_queue_1.default({ concurrency: 100 });
const mitQueue = new p_queue_1.default({ concurrency: 2 });
const getCourseIds = (count = Infinity, marker = null) => {
    return rxjs_1.Observable.create((observer) => __awaiter(this, void 0, void 0, function* () {
        const results = yield new Promise((resolve, reject) => {
            console.log('Getting course ids...');
            s3.listObjects({ Bucket: S3_BUCKET, Delimiter: '/', Marker: marker, MaxKeys: Math.min(count, 100) }, (err, data) => {
                console.log('Course ids:', err, data);
                if (err)
                    return reject(err);
                resolve(data.CommonPrefixes.map(c => c.Prefix));
            });
        });
        results.slice(0, Math.min(count, results.length)).forEach(result => observer.next(result));
        if (results.length)
            getCourseIds(count - results.length, results[results.length - 1]).subscribe(observer);
    }));
};
const getCourseInfo = (courseId) => __awaiter(this, void 0, void 0, function* () {
    const key = yield new Promise((resolve, reject) => {
        s3.listObjects({ Bucket: S3_BUCKET, Prefix: courseId }, (err, data) => {
            if (err)
                return reject(err);
            resolve(data.Contents.find(object => object.Key.endsWith('_master.json')).Key);
        });
    });
    const info = yield new Promise((resolve, reject) => {
        s3.getObject({ Bucket: S3_BUCKET, Key: key }, (err, data) => {
            if (err)
                return reject(err);
            resolve(JSON.parse(data.Body.toString()));
        });
    });
    return info;
});
const makeCourseDocs = (courseInfo) => __awaiter(this, void 0, void 0, function* () {
    const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
    const courseKeywords = courseInfo["tags"].map(tag => {
        return tag.name;
    });
    const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';
    if ((yield mitQueue.add(() => node_fetch_1.default(courseUrl, { method: 'HEAD' }))).status == 404)
        return [];
    const departmentUrl = courseUrl.match(/(.*)\/.*$/)[1];
    const courseName = courseInfo['title'];
    const courseDescription = striptags(courseInfo['description']);
    const coursePagesIndex = courseInfo['course_pages'].reduce((memo, coursePageInfo) => {
        const { uid } = coursePageInfo;
        return Object.assign({}, memo, { [uid]: coursePageInfo });
    }, {});
    const documents = courseInfo['course_files']
        .filter(fileInfo => fileInfo['file_type'] === 'application/pdf' &&
        fileInfo['parent_uid'] in coursePagesIndex &&
        fileInfo['title'] != null &&
        fileInfo['title'] != '3play pdf file' && ((fileInfo['file_location'] != null) ||
        (fileInfo['title'].indexOf(' ') == -1 && fileInfo['title'].slice(-4) == '.pdf'))).map(fileInfo => {
        return Doc.fileToDoc(fileInfo, courseInfo, coursePagesIndex);
    });
    const videos = yield Promise.all(Object.values(courseInfo['course_embedded_media']).filter(mediaInfo => mediaInfo['embedded_media'].some(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream')).map((mediaInfo) => __awaiter(this, void 0, void 0, function* () {
        const youtubeSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream');
        const youtubeId = youtubeSource['media_info'];
        const captionSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === youtubeId + '.srt');
        let captionsUrl, captions = [];
        if (captionSource) {
            captionsUrl = captionSource['technical_location'];
            captions = yield mitQueue.add(() => feedbackfruits_knowledge_engine_1.Captions.getCaptions(captionsUrl));
        }
        return Doc.videoToDoc(mediaInfo, captions, captionsUrl, courseInfo, coursePagesIndex);
    })));
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
        child: [...documents, ...videos]
    };
    return [courseDoc];
});
exports.mine = () => {
    return getCourseIds().pipe(operators_1.concatMap(getCourseInfo), operators_1.concatMap(makeCourseDocs), operators_1.concatMap(docs => docs));
};
