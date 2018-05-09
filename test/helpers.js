import test from 'ava';

import memux from 'memux';
import init from '../lib';
import * as Helpers from '../lib/helpers';

import departments from './support/departments';
import mathematics from './support/mathematics';

test('Helpers.getDepartments: it gets departments', async t => {
  const res = await Helpers.getDepartments();
  return t.deepEqual(res, departments);
});

test.skip('Helpers.getDepartment: it gets a department by id', async t => {
  const res = await Helpers.getDepartment("mathematics");
  return t.deepEqual(res, mathematics);
});
