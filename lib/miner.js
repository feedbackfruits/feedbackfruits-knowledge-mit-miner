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
const rxjs_1 = require("@reactivex/rxjs");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const MIT = require("./mit");
const _Doc = require("./doc");
function mine() {
    return MIT.getDepartments()
        .concatMap(department => {
        const courseDocs = MIT.getCoursesForDepartment(department.id)
            .concatMap(course => {
            const videoDocs = rxjs_1.Observable.from(course.media_resources)
                .concatMap(media_resource => {
                const [name] = Object.keys(media_resource);
                const { path, YouTube: { youtube_id } } = media_resource[name];
                const video = {
                    name,
                    path,
                    youtube_id
                };
                return rxjs_1.Observable.defer(() => __awaiter(this, void 0, void 0, function* () {
                    const captionsUrl = `https://ocw.mit.edu/${path}/${youtube_id}.srt`;
                    let captions = [];
                    try {
                        captions = yield feedbackfruits_knowledge_engine_1.Captions.getCaptions(captionsUrl);
                    }
                    catch (e) {
                        try {
                            console.error(`Skipped error on captions url ${captionsUrl}, retrying without underscores...`);
                            captions = yield feedbackfruits_knowledge_engine_1.Captions.getCaptions(captionsUrl.replace(/\_/g, ''));
                        }
                        catch (e) {
                            console.error(`Skipped error on captions url ${captionsUrl}.`);
                            console.error(e);
                        }
                    }
                    const videoDoc = _Doc.fromVideo(video, course, captions);
                    return videoDoc;
                }));
            });
            const pdfs = Object.entries(course.pdf_list).reduce((memo, [key, list]) => {
                const pdfs = list.map(url => ({ url, type: key }));
                return [...memo, ...pdfs];
            }, []);
            const pdfDocs = rxjs_1.Observable.from(pdfs)
                .concatMap(pdf => {
                const pdfDoc = _Doc.fromPDF(pdf, course);
                return rxjs_1.Observable.from([pdfDoc]);
            });
            const courseDoc = _Doc.fromCourse(course, []);
            return rxjs_1.Observable.concat(videoDocs, pdfDocs, rxjs_1.Observable.from([courseDoc]));
        });
        const departmentDoc = _Doc.fromDepartment(department, []);
        return rxjs_1.Observable.concat(courseDocs, rxjs_1.Observable.from([departmentDoc]));
    });
}
exports.mine = mine;
