import fetch from 'node-fetch';
import * as Config from './config';
import { mine } from './miner';

import { Miner, Helpers, Config as _Config } from 'feedbackfruits-knowledge-engine';

export default async function init({ name }) {
  const send = await Miner({
    name,
    customConfig: Config as any as typeof _Config.Base
  });

  console.log('Starting MIT miner...');
  const docs = mine();

  let count = 0;
  await new Promise((resolve, reject) => {
    docs.subscribe({
      next: async (doc) => {
        count++;
        console.log(`Sending doc number ${count}:`, doc['@id']);
        try {
          const result = await send({ action: 'write', key: doc['@id'], data: doc });
          return result;
        } catch(e) {
          console.log('Miner crashed...');
          reject(e);
        }
      },
      error: (reason) => {
        console.log('Miner crashed...');
        reject(reason);
      },
      complete: () => {
        console.log('Miner completed');
        resolve();
      }
    });
  });

  console.log(`Mined ${count} docs from MIT`);
  return;
}

// Start the server when executed directly
declare const require: any;
if (require.main === module) {
  console.log("Running as script.");
  init({
    name: Config.NAME,
  }).catch(console.error);
}
