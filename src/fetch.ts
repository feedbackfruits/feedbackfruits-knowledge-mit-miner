import _fetch from 'node-fetch';
import PQueue = require('p-queue');

const queue = new PQueue({
  concurrency: 1
});

export default async function fetch(...args) {
  return queue.add( () => _fetch(...args) );
}
