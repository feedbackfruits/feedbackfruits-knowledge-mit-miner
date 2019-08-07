import test from 'ava';
import * as Doc from '../lib/doc';
import * as Support from './support';

test('Doc.fileToDoc: it make a doc out of fileInfo and a coursePageIndex', t => {
  const courseInfo = Support.CourseInfo;
  const coursePagesIndex = courseInfo['course_pages'].reduce((memo, coursePageInfo) => {
    const { uid } = coursePageInfo;
    return {
      ...memo,
      [uid]: coursePageInfo
    };
  }, {});

  const result = Doc.fileToDoc(courseInfo["course_files"][151], courseInfo, coursePagesIndex);
  // console.log(JSON.stringify(result));
  return t.deepEqual(result, Support.Doc);
});
