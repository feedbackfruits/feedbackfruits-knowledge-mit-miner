import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
export declare function departmentToDoc(department: Types.Department, children: string[]): Doc;
export declare function courseToDoc(course: Types.Course, children: string[]): Doc;
export declare function getCaptionsForVideo(video: Types.VideoResource): Promise<Doc[]>;
export declare function videoToResource(video: Types.VideoResource, course: Types.Course): Promise<Doc>;
export declare function pdfToResource(pdf: Types.PDFResource, course: Types.Course): Doc;
