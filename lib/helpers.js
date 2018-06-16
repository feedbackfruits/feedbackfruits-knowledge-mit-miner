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
const fetch_1 = require("./fetch");
const parseSRT = require("parse-srt");
function departmentToDoc(department, children) {
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
exports.departmentToDoc = departmentToDoc;
function courseToDoc(course, children) {
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
exports.courseToDoc = courseToDoc;
function getCaptionsForVideo(video) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path, youtube_id } = video;
        const url = `https://ocw.mit.edu/${path}/${youtube_id}.srt`;
        const response = yield fetch_1.default(url);
        if (response.status !== 200) {
            console.log('No SRT for:', url);
            return [];
        }
        const srt = yield response.text();
        let parsed;
        try {
            parsed = parseSRT(srt);
        }
        catch (e) {
            console.log('Failed parsing:', url);
            throw e;
        }
        const captions = parsed.map(sub => {
            const { id, start, end, text } = sub;
            const duration = end - start;
            const parsedText = text.replace(/<br \/>/, ' ');
            return {
                "@id": `${url}#${id}`,
                "@type": "VideoCaption",
                startsAfter: `PT${start}S`,
                duration: `PT${duration}S`,
                text: parsedText,
                language: "en"
            };
        });
        return captions;
    });
}
exports.getCaptionsForVideo = getCaptionsForVideo;
function videoToResource(video, course) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, path, youtube_id } = video;
        const youtubeUrl = `https://www.youtube.com/watch?v=${youtube_id}`;
        const topicUrl = `https://ocw.mit.edu/${path}`;
        const captions = yield getCaptionsForVideo(video);
        const videoDoc = {
            "@id": youtubeUrl,
            "@type": [
                "Resource",
                "Video"
            ],
            name,
            sourceOrganization: [
                "https://ocw.mit.edu"
            ],
            topic: [
                topicUrl
            ],
            caption: captions
        };
        const topicDoc = {
            "@id": topicUrl,
            "@type": [
                "Topic"
            ],
            child: [videoDoc],
            name
        };
        return topicDoc;
    });
}
exports.videoToResource = videoToResource;
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
function pdfToResource(pdf, course) {
    const { url, type } = pdf;
    const regex = /(.*)\/(.*)\.pdf/;
    const [, topicUrl, pdfName] = url.match(regex);
    let name, description;
    if (type in typeNames) {
        console.log('Filling in name and description for:', pdf);
        const typeName = typeNames[type];
        name = `${course.title} | ${typeName}: ${pdfName}`;
        description = `Part of the learning material of ${course.level} level course ${course.title}.`;
    }
    else {
        console.log('Unknown type:', pdf);
    }
    return Object.assign({ "@id": url, "@type": [
            "Resource",
            "Document"
        ] }, (name ? { name } : {}), (description ? { description } : {}), { sourceOrganization: [
            "https://ocw.mit.edu"
        ], topic: [
            topicUrl
        ] });
}
exports.pdfToResource = pdfToResource;
