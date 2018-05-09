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
function getDepartments() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://ocw.mit.edu/courses/all_departments.json";
        const response = yield node_fetch_1.default(url);
        const departments = yield response.json();
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
function getDepartment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const department_url = `https://ocw.mit.edu/courses/${id}`;
        const department_json_url = `${department_url}/${id}.json`;
        const response = yield node_fetch_1.default(department_json_url);
        const department = yield response.json();
        return department.reduce((memo, dep) => {
            const [id] = Object.keys(dep);
            const { course_title: title, course_image_path: image, course_path: url } = dep[id];
            return [...memo, Object.assign({}, dep[id], { id,
                    title,
                    image,
                    url,
                    department_url })];
        }, []);
        ;
    });
}
exports.getDepartment = getDepartment;
function departmentToDoc(department, courses) {
    const children = courses.map(course => course.url);
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
    return {
        "@id": course.url,
        "@type": [
            "Topic",
            "Resource"
        ],
        name: course.title,
        description: course.description,
        parent: course.department_url,
    };
}
exports.courseToDoc = courseToDoc;
