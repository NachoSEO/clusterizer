
import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { DBSCAN } from 'density-clustering';
import fs from 'fs';
import EventEmitter from 'events';

import { steamizer } from './steamizer.js';
import kws from './kws.js'

const [, , mode] = process.argv;
const loadingEventEmitter = new EventEmitter(); // Declare the event emitter in the outer scope

async function main(keywords) {
  const data = await steamizer(keywords)
  const stems = extractStemmedKeywords(data)

  // Load the Universal Sentence Encoder model
  const model = await use.load();

  // Convert keywords to embeddings (numeric representation)
  const embeddings = await model.embed(stems);
  const embeddingsArray = embeddings.arraySync();

  // Perform clustering using DBSCAN
  const eps = 0.3; // Radius of the neighborhood
  const minPoints = 2; // Minimum number of points required to form a dense region
  const dbscan = new DBSCAN();
  const clusters = dbscan.run(embeddingsArray, eps, minPoints);

  const updatedData = data.map((item, index) => {
    const clusterIndex = clusters.findIndex(cluster => cluster.includes(index));
    return { ...item, cluster: clusterIndex === -1 ? 'Noise' : `Cluster ${clusterIndex + 1}` };
  });

  return { updatedData, clusters };
}


function extractStemmedKeywords(steamizerOutput) {
  return steamizerOutput.map(item => item.stem);
}

function twirlLoadingEffect() {
    const twirlChars = ['-', '\\', '|', '/'];
    let index = 0;

    const interval = setInterval(() => {
      process.stdout.write(`\r${twirlChars[index]} Generating clusters...`);
      index = (index + 1) % twirlChars.length;
    }, 100);

    loadingEventEmitter.on('loadingComplete', () => {
      clearInterval(interval);
      process.stdout.write('\n'); // Move to the next line after loading is done
      console.log('Task done!')
    });
}

main(kws).then(async ({ updatedData, clusters }) => {
  //console.log('Updated Data:', updatedData);
  if (mode === 'csv') {
    await fs.promises.writeFile('./out.csv', '')
  } else if(mode === 'txt') {
    await fs.promises.writeFile('./out.txt', '')
  }

  // Print clustered keywords
  clusters.forEach((cluster, i) => {
    if (mode === 'logs') {
      console.log(`Cluster ${i + 1}:`);
    }
    cluster.forEach(async pointIndex => {
      if (mode === 'logs') {
        console.log(`  - ${updatedData[pointIndex].query}`);
      } else if (mode === 'csv') {
        await fs.promises.appendFile('./out.csv', `Cluster ${i + 1},${updatedData[pointIndex].query}\n`)
      } else if(mode === 'txt') {
        await fs.promises.appendFile('./out.txt', `Cluster ${i + 1},${updatedData[pointIndex].query}\n`)
      }
    });
  });

  // Handle noise points (not assigned to any cluster)
  const noise = clusters
    .flat()
    .filter((_, index) => !clusters.some(cluster => cluster.includes(index)));

  if (noise.length > 0) {
    if (mode === 'logs') {
      console.log('Noise:');
    }
    noise.forEach(async pointIndex => {
      if (mode === 'logs') {
        console.log(`  - ${updatedData[pointIndex].query}`);
      } else if (mode === 'csv') {
        await fs.promises.appendFile('./out.csv', `Noise,${updatedData[pointIndex].query}\n`)
      } else if(mode === 'txt') {
        await fs.promises.appendFile('./out.txt', `Noise,${updatedData[pointIndex].query}\n`)
      }
    });
  }
}).then(() => {
  loadingEventEmitter.emit('loadingComplete');
})

twirlLoadingEffect();
