import test from 'ava';
import * as path from 'path';

import memux from 'memux';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC } from '../lib/config';
import proxyquire from 'proxyquire';
import AWSMock from 'mock-aws-s3';
import * as Support from './support';

const bucketPath = path.join(__dirname, '../mock-s3');
console.log('bucketPath:', bucketPath);
AWSMock.config.basePath = bucketPath;

const init = proxyquire('../lib', {
  './miner': proxyquire('../lib/miner', {
    'aws-sdk': AWSMock,
  })
}).default;

test('it exists', t => {
  t.not(init, undefined);
});

test('it works', async (t) => {
  try {
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      // if ([].concat(message.data["@type"]).find(type => type === "Document")) _resolve(message);
      if (message.key === "https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/exams/MIT18_06S10_exam1_s10_sol.pdf") _resolve(message);
    };

    await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: OUTPUT_TOPIC,
      receive,
      options: {
        concurrency: 1
      }
    });

    // Do not await init here, it will wait for the miner to finish mining before resolving
    init({
      name: NAME,
    });

    const result = await resultPromise;
    console.log('Result data:', JSON.stringify(result.data));
    return t.deepEqual(result, {
      action: 'write',
      label: "feedbackfruits-knowledge-mit-miner",

      key: Support.DocumentCompacted["@id"],
      data: Support.DocumentCompacted
    });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
