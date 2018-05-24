"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function departmentToDoc(department, courses) {
    const children = courses.map(course => courseToDoc(course));
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
function courseToDoc(course) {
    const videos = course.media_resources.map((media_resource) => {
        const [name] = Object.keys(media_resource);
        const { path, YouTube: { youtube_id } } = media_resource[name];
        return {
            name,
            path,
            youtube_id
        };
    });
    const pdfs = Object.entries(course.pdf_list).reduce((memo, [key, list]) => {
        const pdfs = list.map(url => ({ url }));
        return [...memo, ...pdfs];
    }, []);
    const children = [...pdfs.map(pdf => pdfToResource(pdf, course)), ...videos.map(video => videoToResource(video, course))];
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
function videoToResource(video, course) {
    const { name, path, youtube_id } = video;
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtube_id}`;
    const videoDoc = {
        "@id": youtubeUrl,
        "@type": [
            "Resource",
            "Video"
        ],
        name
    };
    const topicUrl = `https://ocw.mit.edu/${path}`;
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
exports.videoToResource = videoToResource;
function pdfToResource(pdf, course) {
    const { url } = pdf;
    return {
        "@id": url,
        "@type": [
            "Resource",
            "Document"
        ]
    };
}
exports.pdfToResource = pdfToResource;
