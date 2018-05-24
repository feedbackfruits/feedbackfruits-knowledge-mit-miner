import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
export declare function departmentToDoc(department: Types.Department, courses: Types.Course[]): Doc;
export declare function courseToDoc(course: Types.Course): Doc;
export declare function videoToResource(video: Types.VideoResource, course: Types.Course): Doc;
export declare function pdfToResource(pdf: Types.PDFResource, course: Types.Course): Doc;
