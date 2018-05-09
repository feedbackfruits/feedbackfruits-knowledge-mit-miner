import test from 'ava';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

test('it exists', t => {
  t.not(init, undefined);
});

test.skip('it works', async (t) => {
  try {
    let _resolve, _reject;
    // const resultPromise = new Promise((resolve, reject) => {
    //   _resolve = resolve;
    //   _reject = reject;
    // });
    //
    // const receive = (message) => {
    //   console.log('Received message!', message);
    //   _resolve(message);
    // };
    //
    // await memux({
    //   name: 'dummy-broker',
    //   url: KAFKA_ADDRESS,
    //   input: OUTPUT_TOPIC,
    //   receive,
    //   options: {
    //     concurrency: 1
    //   }
    // });
    //
    // await init({
    //   name: NAME,
    // });
    //
    // const result = await resultPromise;
    // console.log('Result data:', result.data);
    // return t.deepEqual(result, {
    //   action: 'write',
    //   data: {}
    // });
    return t.fail();
  } catch(e) {
    console.error(e);
    throw e;
  }
});
