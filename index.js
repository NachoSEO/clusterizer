
import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { DBSCAN } from 'density-clustering'

import { steamizer } from './steamizer.js';
import kws from './kws.js'

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

main(kws).then(({ updatedData, clusters }) => {
  console.log('Updated Data:', updatedData);

  // Print clustered keywords
  clusters.forEach((cluster, i) => {
    console.log(`Cluster ${i + 1}:`);
    cluster.forEach(pointIndex => {
      console.log(`  - ${updatedData[pointIndex].query}`);
    });
  });

  // Handle noise points (not assigned to any cluster)
  const noise = clusters
    .flat()
    .filter((_, index) => !clusters.some(cluster => cluster.includes(index)));
  if (noise.length > 0) {
    console.log('Noise:');
    noise.forEach(pointIndex => {
      console.log(`  - ${updatedData[pointIndex].query}`);
    });
  }
});






