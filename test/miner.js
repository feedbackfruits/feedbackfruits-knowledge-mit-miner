import * as path from 'path';
import test from 'ava';

import proxyquire from 'proxyquire';
import AWSMock from 'mock-aws-s3';

const bucketPath = path.join(__dirname, '../mock-s3');
console.log('bucketPath:', bucketPath);
AWSMock.config.basePath = bucketPath;

const Miner = proxyquire('../lib/miner', {
  'aws-sdk': AWSMock
});

test("it mines docs", async t => {
  const docs = Miner.mine();
  let _resolve, _reject;
  const resultPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  docs.subscribe({
    next: doc => {
      console.log('Doc mined!', doc);
      _resolve(doc);
    },
    error: (err) => console.error(err),
    complete: () => {},
  });
  console.log(docs);

  await resultPromise;

  return t.pass();
});
