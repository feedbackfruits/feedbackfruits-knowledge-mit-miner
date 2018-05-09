import { Observable } from '@reactivex/rxjs';
import { Quad, Doc, Helpers } from 'feedbackfruits-knowledge-engine';
//
// import * as Types from './types';
//
export function mine(): Observable<Doc> {
  return new Observable<Doc>(observer => {
    observer.complete();
  });
  // const things = treeToObservable({}, topictree);
  // return things.mergeMap(({ context, thing }) => {
  //   if (thing.kind === 'Video') {
  //     return [ Types.videoToDoc(thing) ];
  //   } else if (thing.kind === 'Topic') {
  //     return [ Types.topicToDoc(context, thing) ];
  //   }
  // });
}
//
// export function treeToObservable(context, thing): Observable<{ context, thing }> {
//   return new Observable(observer => {
//     if (thing.kind === 'Video') {
//       observer.next({ context, thing });
//       observer.complete();
//     } else if (thing.kind === 'Topic') {
//       observer.next({ context, thing });
//
//       const id = thing.ka_url;
//       const { observable } = thing.children.reduce((context, thing) => {
//         const childObservable = treeToObservable(context, thing);
//         const childId = thing.ka_url;
//         return {
//           ...context,
//           previous: childId,
//           observable: Observable.merge(context.observable, childObservable)
//         };
//       }, {
//         parent: id,
//         previous: '',
//         observable: Observable.empty()
//       });
//
//       observable.subscribe(observer);
//     }
//   });
// }
