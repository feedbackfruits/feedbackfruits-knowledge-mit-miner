import { Doc } from 'feedbackfruits-knowledge-engine';
export declare type Department = {
    id: string;
    title: string;
    image: string;
    url: string;
};
export declare type Course = {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    department_url: string;
    level: string;
    master_course_number: string;
    faculty: string[];
    year: string;
    term: string;
    course_section_and_tlp_urls: string[];
    media_resources: Object[];
};
export declare function getDepartments(): Promise<Department[]>;
export declare function getDepartment(id: string): Promise<Course[]>;
export declare function departmentToDoc(department: Department, courses: Course[]): Doc;
export declare function courseToDoc(course: Course): Doc;
