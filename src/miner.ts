import fetch from 'node-fetch';
import { Observable } from '@reactivex/rxjs';
import { Quad, Doc, Context } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
import * as Helpers from './helpers';
//
// import * as Types from './types';
//
export function mine(): Observable<Doc> {
  return new Observable<Doc>(observer => {
    (async () => {
      try {
        const departments = await getDepartments();
        await departments.reduce(async (memo, department) => {
          const { id } = department;
          const courses = await getCoursesForDepartment(id);
          const departmentDoc = Helpers.departmentToDoc(department, courses);
          const docs = await Doc.flatten(departmentDoc, Context.context);
          docs.forEach(doc => observer.next(doc));
          return;
        }, Promise.resolve());
        observer.complete();
      } catch(e) {
        console.error('Error:', e);
        observer.error(e);
      }
    })()
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

export async function getDepartments(): Promise<Types.Department[]> {
  const url  = "https://ocw.mit.edu/courses/all_departments.json";
  const response = await fetch(url);

  const text = await response.text();
  let departments;
  try {
    departments = JSON.parse(text);
  } catch(e) {
    console.error(`Fetch ${url} broke on parsing JSON:`, text);
    throw e;
  }

  return departments.reduce((memo, dep) => {
    const [ id ] = Object.keys(dep);
    const { title, dept_image_url: image, home_url: url } = dep[id];
    return [ ...memo, {
      id,
      title,
      image,
      url
    }];
  }, []);
}

export async function getCoursesForDepartment(id: string): Promise<Types.Course[]> {
  const department_url = `https://ocw.mit.edu/courses/${id}`;
  const department_json_url  = `${department_url}/${id}.json`;
  const response = await fetch(department_json_url);
  const text = await response.text();
  let courses;
  try {
    courses = JSON.parse(text);
  } catch(e) {
    console.error(`Fetch ${department_json_url} broke on parsing JSON:`, text);
    throw e;
  }

  return courses.reduce((memo, course) => {
    const [ id ] = Object.keys(course);
    const { course_title: title, course_image_path: image, course_path: url } = course[id];
    return [ ...memo, {
      ...course[id],

      id,
      title,
      image,
      url,
      department_url
    }];
  }, []);;
}
