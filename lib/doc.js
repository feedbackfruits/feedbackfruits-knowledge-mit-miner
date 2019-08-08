"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
exports.seasonMap = {
    "Spring": "03-01",
    "Summer": "06-01",
    "Fall": "09-01",
    "Winter": "12-01",
};
function fileToDoc(fileInfo, courseInfo, coursePageIndex) {
    const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
    const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';
    const courseKeywords = courseInfo["tags"].map(tag => {
        return tag.name;
    });
    const courseLanguage = courseInfo["language"];
    const courseLevel = courseInfo["course_level"];
    const courseStartYear = courseInfo["from_year"];
    const courseStartSemester = courseInfo["from_semester"];
    const dateString = `${courseStartYear}-${exports.seasonMap[courseStartSemester]}`;
    let courseStartDate;
    try {
        courseStartDate = (new Date(dateString)).toISOString();
    }
    catch (e) {
    }
    const fileName = fileInfo['title'];
    const fileDescription = fileInfo['description'];
    const parent = coursePageIndex[fileInfo['parent_uid']];
    const parentUrl = parent['url'];
    const learningResourceType = parent['short_url'];
    const originalFileUrl = `https://ocw.mit.edu${parentUrl}/${fileName}`;
    return Object.assign({ "@id": originalFileUrl, "@type": [
            "Resource",
            "Document"
        ], name: fileName, description: fileDescription, keywords: courseKeywords, license: mitLicense, learningResourceType: learningResourceType, inLanguage: courseLanguage }, (courseStartDate != null ? { dateCreated: courseStartDate } : {}), { educationalLevel: courseLevel, sourceOrganization: [
            "https://ocw.mit.edu"
        ], topic: courseUrl });
}
exports.fileToDoc = fileToDoc;
function videoToDoc(mediaInfo, captions, captionsUrl, courseInfo, coursePageIndex) {
    const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
    const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';
    const courseKeywords = courseInfo["tags"].map(tag => {
        return tag.name;
    });
    const courseLanguage = courseInfo["language"];
    const courseLevel = courseInfo["course_level"];
    const courseStartYear = courseInfo["from_year"];
    const courseStartSemester = courseInfo["from_semester"];
    const dateString = `${courseStartYear}-${exports.seasonMap[courseStartSemester]}`;
    let courseStartDate;
    try {
        courseStartDate = (new Date(dateString)).toISOString();
    }
    catch (e) {
    }
    const mediaName = mediaInfo['title'];
    const youtubeSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream');
    const youtubeUrl = 'http://youtube.com/watch?v=' + youtubeSource['media_info'];
    let metadata;
    if (captions.length)
        metadata = feedbackfruits_knowledge_engine_1.Captions.toMetadata(captions);
    const parent = coursePageIndex[mediaInfo['parent_uid']];
    const learningResourceType = parent['short_url'];
    return Object.assign({ "@id": youtubeUrl, "@type": [
            "Resource",
            "Video"
        ], name: mediaName, keywords: courseKeywords, learningResourceType: learningResourceType, inLanguage: courseLanguage }, (courseStartDate != null ? { dateCreated: courseStartDate } : {}), { educationalLevel: courseLevel, license: mitLicense, sourceOrganization: [
            "https://ocw.mit.edu"
        ], topic: courseUrl }, (captions.length ? {
        caption: [captionsUrl],
        contentDuration: metadata.totalDuration,
        contentLength: metadata.totalLength,
    } : {}));
}
exports.videoToDoc = videoToDoc;
