import fetch from 'node-fetch';
import { Observable, operators } from '@reactivex/rxjs';
import * as Types from './types';

export function getDepartments(): Observable<Types.Department> {
  return Observable.defer(async () => {
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
  }).concatAll();
}

export function getCoursesForDepartment(id: string): Observable<Types.Course> {
  return Observable.defer(async () => {
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
  }).concatAll();
}
