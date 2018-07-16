import test from 'ava';
import * as MIT from '../lib/mit';

import * as Support from './support';

// test('it exists', t => {
//   t.not(MIT, undefined);
// });

test('MIT.getDepartments: it gets departments', async (t) => {
  let _resolve, _reject;
  const completedPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  MIT.getDepartments().toArray().subscribe(res => _resolve(res), err => _reject(err));
  const res = await completedPromise;
  // console.log('Res:', JSON.stringify(res));
  return t.deepEqual(res, Support.Departments);
});


test.skip('MIT.getCoursesForDepartment: it gets courses for a department', async (t) => {
  const department = "mathematics";

  let _resolve, _reject;
  const completedPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  MIT.getCoursesForDepartment(department).toArray().subscribe(res => _resolve(res), err => _reject(err));
  const res = await completedPromise;
  // console.log('Res:', JSON.stringify(res));
  return t.deepEqual(res, Support.MathematicsDepartment);
});
