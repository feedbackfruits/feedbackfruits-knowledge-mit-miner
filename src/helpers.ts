import fetch from 'node-fetch';
import { Doc } from 'feedbackfruits-knowledge-engine';

export type Department = {
  id: string,
  title: string,
  image: string,
  url: string,
};

export type Course = {
  id: string,

  title: string,
  description: string, // Note: description may contain HTML
  image: string,
  url: string,
  department_url: string,

  level: string, // i.e. Graduate, Undergraduate, Post-Graduate, etc
  master_course_number: string,
  faculty: string[],
  year: string,
  term: string,

  course_section_and_tlp_urls: string[],
  media_resources: Object[],
};

export async function getDepartments(): Promise<Department[]> {
  const url  = "https://ocw.mit.edu/courses/all_departments.json";
  const response = await fetch(url);
  const departments = await response.json();
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

export async function getDepartment(id: string): Promise<Course[]> {
  const department_url = `https://ocw.mit.edu/courses/${id}`;
  const department_json_url  = `${department_url}/${id}.json`;
  const response = await fetch(department_json_url);
  const department = await response.json();
  return department.reduce((memo, dep) => {
    const [ id ] = Object.keys(dep);
    const { course_title: title, course_image_path: image, course_path: url } = dep[id];
    return [ ...memo, {
      ...dep[id],

      id,
      title,
      image,
      url,
      department_url
    }];
  }, []);;
}

export function departmentToDoc(department: Department, courses: Course[]): Doc {
  const children = courses.map(course => course.url);
  return {
    "@id": department.url,
    "@type": [
      "Topic"
    ],
    name: department.title,
    image: department.image,
    child: children
  }
}

export function courseToDoc(course: Course): Doc {
  return {
    "@id": course.url,
    "@type": [
      "Topic",
      "Resource"
    ],
    name: course.title,
    description: course.description,
    parent: course.department_url,

  }
}
