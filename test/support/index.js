import test from 'ava';

import Doc from './doc';
import DocumentCompacted from './document-compacted';
import CourseInfo from './course-info';

test.skip('Support noop', () => {
  t.pass();
});

export {
  Doc,
  DocumentCompacted,
  CourseInfo
};
