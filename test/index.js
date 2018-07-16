import test from 'ava';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

import * as Support from './support';

test('it exists', t => {
  t.not(init, undefined);
});

test.skip('it works', async (t) => {
  try {
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      if ([].concat(message.data["@type"]).find(type => type === "Video")) _resolve(message);
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
    // console.log('Result data:', JSON.stringify(result.data));
    return t.deepEqual(result, {
      action: 'write',
      label: "feedbackfruits-knowledge-mit-miner",

      key: Support.Video["@id"],
      data: Support.Video
    });
  } catch(e) {
    console.error(e);
    throw e;
  }
});
