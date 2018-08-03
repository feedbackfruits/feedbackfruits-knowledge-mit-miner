import { Doc, Captions } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
export declare function fromDepartment(department: Types.Department, children: string[]): Doc;
export declare function fromCourse(course: Types.Course, children: string[]): Doc;
export declare function fromVideo(video: Types.VideoResource, course: Types.Course, captions?: Captions.Caption[]): Doc;
