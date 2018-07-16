import { Observable } from '@reactivex/rxjs';
import * as Types from './types';
export declare function getDepartments(): Observable<Types.Department>;
export declare function getCoursesForDepartment(id: string): Observable<Types.Course>;
