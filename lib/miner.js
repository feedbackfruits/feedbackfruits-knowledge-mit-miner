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
const node_fetch_1 = require("node-fetch");
const rxjs_1 = require("@reactivex/rxjs");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const Helpers = require("./helpers");
function mine() {
    return new rxjs_1.Observable(observer => {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield getDepartments();
                yield departments.reduce((memo, department) => __awaiter(this, void 0, void 0, function* () {
                    const { id } = department;
                    const courses = yield getCoursesForDepartment(id);
                    const departmentDoc = Helpers.departmentToDoc(department, courses);
                    const docs = yield feedbackfruits_knowledge_engine_1.Doc.flatten(departmentDoc, feedbackfruits_knowledge_engine_1.Context.context);
                    docs.forEach(doc => observer.next(doc));
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
        const response = yield node_fetch_1.default(url);
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
        const response = yield node_fetch_1.default(department_json_url);
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
