import fetch from './fetch';
import { Observable } from '@reactivex/rxjs';
import { Doc, Captions } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
// import * as Helpers from './helpers';
import * as MIT from './mit';
import * as _Doc from './doc';
//
// import * as Types from './types';
//
export function mine(): Observable<Doc> {
  return MIT.getDepartments()
    .concatMap(department => {
      const courseDocs = MIT.getCoursesForDepartment(department.id)
        .concatMap(course => {
          const videoDocs = Observable.from(course.media_resources)
            .concatMap(media_resource => {
              const [ name ] = Object.keys(media_resource);
              const { path, YouTube: { youtube_id } } = media_resource[name];
              const video = {
                name,
                path,
                youtube_id
              };

              return Observable.defer(async () => {
                const captionsUrl = `https://ocw.mit.edu/${path}/${youtube_id}.srt`;
                let captions = [];
                try {
                  captions = await Captions.getCaptions(captionsUrl);
                } catch(e) {
                  try {
                    console.error(`Skipped error on captions url ${captionsUrl}, retrying without underscores...`);
                    captions = await Captions.getCaptions(captionsUrl.replace(/\_/g, ''));
                  } catch(e) {
                    console.error(`Skipped error on captions url ${captionsUrl}.`);
                    console.error(e);
                  }
                }
                const videoDoc = _Doc.fromVideo(video, course, captions);
                return videoDoc;
              })
            });

          const pdfs = Object.entries(course.pdf_list).reduce<Types.PDFResource[]>((memo, [ key, list ]) => {
            const pdfs = list.map(url => ({ url, type: <any>key }));
            return [ ...memo, ...pdfs ];
          }, []);

          const pdfDocs = Observable.from(pdfs)
            .concatMap(pdf => {
              const pdfDoc = _Doc.fromPDF(pdf, course)
              return Observable.from([ pdfDoc ]);
            });

          const courseDoc = _Doc.fromCourse(course, []);
          return Observable.concat(videoDocs, pdfDocs, Observable.from([ courseDoc ]));
        })


      const departmentDoc = _Doc.fromDepartment(department, []);
      return Observable.concat(courseDocs, Observable.from([ departmentDoc ]));
    });
  // const departments = Observable
  //   .fromPromise(getDepartments())
  //   .flatMap(departments => Observable.from(departments))
  //   .concatMap(department => {
  //     const { id } = department;
  //     const courses = Observable.fromPromise(getCoursesForDepartment(id)).concatMap(course => {
  //       return Observable.concat(Observable.from([ courseDoc ]));
  //     });
  //
  //     const departmentDoc = Helpers.departmentToDoc(department, courseDocs.map(doc => doc["@id"]));
  //     return Observable.concat(courses, Observable.from([ departmentDoc ]));
  //   });

  // return new Observable<Doc>(observer => {
  //   (async () => {
  //     try {
  //
  //       await departments.reduce(async (memo, department) => {
  //         const { id } = department;
  //         const courses = await getCoursesForDepartment(id);
  //         const courseDocs = await courses.reduce(async (memo, course) => {
  //           const videoDocs = await course.media_resources.reduce<Promise<Doc[]>>(async (memo, media_resource) => {
  //             const [ name ] = Object.keys(media_resource);
  //             const { path, YouTube: { youtube_id } } = media_resource[name];
  //
  //             const video = {
  //               name,
  //               path,
  //               youtube_id
  //             };
  //
  //             const videoDoc = await Helpers.videoToResource(video, course);
  //             observer.next(videoDoc);
  //
  //             return [ ...(await memo), videoDoc ];
  //           }, Promise.resolve<Doc[]>([]));
  //
  //           const pdfDocs: Doc[] = Object.entries(course.pdf_list).reduce<Types.PDFResource[]>((memo, [ key, list ]) => {
  //             const pdfs = list.map(url => ({ url, type: <any>key }));
  //             return [ ...memo, ...pdfs ];
  //           }, []).map(pdf => {
  //             const pdfDoc = Helpers.pdfToResource(pdf, course)
  //
  //             observer.next(pdfDoc);
  //
  //             return pdfDoc;
  //           });
  //
  //           const children = [ ...pdfDocs, ...videoDocs ].map(doc => doc["@id"]);
  //
  //           const courseDoc = await Helpers.courseToDoc(course, children);
  //           observer.next(courseDoc);
  //
  //           return [ ...(await memo), courseDoc ];
  //         }, Promise.resolve([]));
  //
  //         const departmentDoc = await Helpers.departmentToDoc(department, courseDocs.map(doc => doc["@id"]));
  //         observer.next(departmentDoc);
  //         // const docs = await Doc.flatten(departmentDoc, Context.context);
  //         // docs.forEach(doc => observer.next(doc));
  //         return;
  //       }, Promise.resolve());
  //
  //       observer.complete();
  //     } catch(e) {
  //       console.error('Error:', e);
  //       observer.error(e);
  //     }
  //   })()
  // });
}
