"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function fromDepartment(department, children) {
    return {
        "@id": department.url,
        "@type": [
            "Topic"
        ],
        name: department.title,
        image: department.image,
        child: children
    };
}
exports.fromDepartment = fromDepartment;
function fromCourse(course, children) {
    return {
        "@id": course.url,
        "@type": [
            "Topic",
            "Resource"
        ],
        name: course.title,
        description: course.description,
        parent: course.department_url,
        child: children
    };
}
exports.fromCourse = fromCourse;
function fromVideo(video, course, captions = []) {
    const { name, path, youtube_id } = video;
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtube_id}`;
    const topicUrl = `https://ocw.mit.edu/${path}`;
    let metadata;
    if (captions.length)
        metadata = feedbackfruits_knowledge_engine_1.Captions.toMetadata(captions);
    const [captionsUrl] = captions[0]["@id"].split("#");
    const videoDoc = Object.assign({ "@id": youtubeUrl, "@type": [
            "Resource",
            "Video"
        ], name, sourceOrganization: [
            "https://ocw.mit.edu"
        ], topic: [
            topicUrl
        ] }, (captions.length ? {
        caption: [captionsUrl],
        contentDuration: metadata.totalDuration,
        contentLength: metadata.totalLength,
    } : {}));
    const topicDoc = {
        "@id": topicUrl,
        "@type": [
            "Topic"
        ],
        child: [videoDoc],
        name
    };
    return topicDoc;
}
exports.fromVideo = fromVideo;
const typeNames = {
    'assignments': 'Assignment',
    'readings': 'Reading',
    'lecture-notes': 'Lecture notes',
    'lecture-slides': 'Lecture slides',
    'exams': 'Exam',
    'study-materials': 'Study materials',
    'recitations': 'Recitations',
    'readings-notes-slides': 'Reading-notes slides',
    'labs': 'Labs',
    'syllabus': 'Syllabus',
    'projects': 'Project',
    'problem-solving': 'Problem solving',
    'class-activities': 'Class activity',
    'experiments': 'Experiment',
    'related-resources': 'Related resource',
};
function fromPDF(pdf, course) {
    const { url, type } = pdf;
    const regex = /(.*)\/(.*)\.pdf/;
    const [, topicUrl, pdfName] = url.match(regex);
    let description;
    if (type in typeNames) {
        console.log('Filling in description for:', pdf);
        const typeName = typeNames[type];
        description = `Part of the learning material of ${course.level} level course ${course.title}.`;
    }
    else {
        console.log('Unknown type:', pdf);
    }
    return Object.assign({ "@id": url, "@type": [
            "Resource",
            "Document"
        ] }, (description ? { description } : {}), { sourceOrganization: [
            "https://ocw.mit.edu"
        ], topic: [
            topicUrl
        ] });
}
exports.fromPDF = fromPDF;
