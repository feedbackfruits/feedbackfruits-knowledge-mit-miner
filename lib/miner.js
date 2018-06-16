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
const rxjs_1 = require("@reactivex/rxjs");
const Helpers = require("./helpers");
function mine() {
    return new rxjs_1.Observable(observer => {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield getDepartments();
                yield departments.reduce((memo, department) => __awaiter(this, void 0, void 0, function* () {
                    const { id } = department;
                    const courses = yield getCoursesForDepartment(id);
                    const courseDocs = yield courses.reduce((memo, course) => __awaiter(this, void 0, void 0, function* () {
                        const videoDocs = yield course.media_resources.reduce((memo, media_resource) => __awaiter(this, void 0, void 0, function* () {
                            const [name] = Object.keys(media_resource);
                            const { path, YouTube: { youtube_id } } = media_resource[name];
                            const video = {
                                name,
                                path,
                                youtube_id
                            };
                            const videoDoc = yield Helpers.videoToResource(video, course);
                            observer.next(videoDoc);
                            return [...(yield memo), videoDoc];
                        }), Promise.resolve([]));
                        const pdfDocs = Object.entries(course.pdf_list).reduce((memo, [key, list]) => {
                            const pdfs = list.map(url => ({ url, type: key }));
                            return [...memo, ...pdfs];
                        }, []).map(pdf => {
                            const pdfDoc = Helpers.pdfToResource(pdf, course);
                            observer.next(pdfDoc);
                            return pdfDoc;
                        });
                        const children = [...pdfDocs, ...videoDocs].map(doc => doc["@id"]);
                        const courseDoc = yield Helpers.courseToDoc(course, children);
                        observer.next(courseDoc);
                        return [...(yield memo), courseDoc];
                    }), Promise.resolve([]));
                    const departmentDoc = yield Helpers.departmentToDoc(department, courseDocs.map(doc => doc["@id"]));
                    observer.next(departmentDoc);
                    return;
                }), Promise.resolve());
                observer.complete();
            }
            catch (e) {
                console.error('Error:', e);
                observer.error(e);
            }
        }))();
    });
}
exports.mine = mine;
function getDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://ocw.mit.edu/courses/all_departments.json";
        const response = yield fetch_1.default(url);
        const text = yield response.text();
        let departments;
        try {
            departments = JSON.parse(text);
        }
        catch (e) {
            console.error(`Fetch ${url} broke on parsing JSON:`, text);
            throw e;
        }
        return departments.reduce((memo, dep) => {
            const [id] = Object.keys(dep);
            const { title, dept_image_url: image, home_url: url } = dep[id];
            return [...memo, {
                    id,
                    title,
                    image,
                    url
                }];
        }, []);
    });
}
exports.getDepartments = getDepartments;
function getCoursesForDepartment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const department_url = `https://ocw.mit.edu/courses/${id}`;
        const department_json_url = `${department_url}/${id}.json`;
        const response = yield fetch_1.default(department_json_url);
        const text = yield response.text();
        let courses;
        try {
            courses = JSON.parse(text);
        }
        catch (e) {
            console.error(`Fetch ${department_json_url} broke on parsing JSON:`, text);
            throw e;
        }
        return courses.reduce((memo, course) => {
            const [id] = Object.keys(course);
            const { course_title: title, course_image_path: image, course_path: url } = course[id];
            return [...memo, Object.assign({}, course[id], { id,
                    title,
                    image,
                    url,
                    department_url })];
        }, []);
        ;
    });
}
exports.getCoursesForDepartment = getCoursesForDepartment;
