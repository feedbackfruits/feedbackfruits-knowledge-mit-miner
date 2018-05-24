import { Observable } from '@reactivex/rxjs';
import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';
export declare function mine(): Observable<Doc>;
export declare function getDepartments(): Promise<Types.Department[]>;
export declare function getCoursesForDepartment(id: string): Promise<Types.Course[]>;
