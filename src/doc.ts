import { Captions } from 'feedbackfruits-knowledge-engine';

// https://www.timeanddate.com/calendar/aboutseasons.html
// Spring runs from March 1 to May 31;
// Summer runs from June 1 to August 31;
// Fall (autumn) runs from September 1 to November 30; and
// Winter runs from December 1 to February 28 (February 29 in a leap year).

export const seasonMap = {
  "Spring": "03-01",
  "Summer": "06-01",
  "Fall": "09-01",
  "Winter": "12-01",
};

export function fileToDoc(fileInfo, courseInfo, coursePageIndex) {
  const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
  const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';
  const courseKeywords = courseInfo["tags"].map(tag => {
    return tag.name;
  });
  const courseLanguage = courseInfo["language"];
  const courseLevel = courseInfo["course_level"];
  const courseStartYear = courseInfo["from_year"];
  const courseStartSemester = courseInfo["from_semester"];

  const dateString = `${courseStartYear}-${seasonMap[courseStartSemester]}`;
  const courseStartDate = (new Date(dateString)).toISOString();

  const fileName = fileInfo['title'];
  const fileDescription = fileInfo['description'];

  const parent = coursePageIndex[fileInfo['parent_uid']];
  const parentUrl = parent['url'];
  const learningResourceType = parent['short_url'];

  const originalFileUrl = `https://ocw.mit.edu${parentUrl}/${fileName}`;

  return {
    "@id": originalFileUrl,
    "@type": [
      "Resource",
      "Document"
    ],
    name: fileName,
    description: fileDescription,
    keywords: courseKeywords,
    license: mitLicense,
    learningResourceType: learningResourceType,
    inLanguage: courseLanguage,
    dateCreated: courseStartDate,
    educationalLevel: courseLevel,
    sourceOrganization: [
      "https://ocw.mit.edu"
    ],
    topic: courseUrl
  };
}

export function videoToDoc(mediaInfo, captions, captionsUrl, courseInfo, coursePageIndex) {
  const courseUrl = 'https://ocw.mit.edu' + courseInfo['url'];
  const mitLicense = 'http://creativecommons.org/licenses/by-nc-sa/4.0/';
  const courseKeywords = courseInfo["tags"].map(tag => {
    return tag.name;
  });
  const courseLanguage = courseInfo["language"];
  const courseLevel = courseInfo["course_level"];
  const courseStartYear = courseInfo["from_year"];
  const courseStartSemester = courseInfo["from_semester"];

  const dateString = `${courseStartYear}-${seasonMap[courseStartSemester]}`;
  const courseStartDate = (new Date(dateString)).toISOString();

  const mediaName = mediaInfo['title'];
  const youtubeSource = mediaInfo['embedded_media'].find(sourceInfo => sourceInfo['id'] === 'Video-YouTube-Stream');
  const youtubeUrl = 'http://youtube.com/watch?v=' + youtubeSource['media_info'];

  let metadata;
  if (captions.length) metadata = Captions.toMetadata(captions);

  const parent = coursePageIndex[mediaInfo['parent_uid']];
  const learningResourceType = parent['short_url'];

  return {
    "@id": youtubeUrl,
    "@type": [
      "Resource",
      "Video"
    ],
    name: mediaName,
    keywords: courseKeywords,
    learningResourceType: learningResourceType,
    inLanguage: courseLanguage,
    dateCreated: courseStartDate,
    educationalLevel: courseLevel,
    license: mitLicense,
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
}
