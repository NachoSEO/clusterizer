export default class ClusterizerService {
  constructor({ clusterizerRepository, fileRepository }) {
    this.clusterizerRepository = clusterizerRepository;
    this.fileRepository = fileRepository;
  }

  async execute({ mode }) {
    const keywords = await this._formatTextFile({ path: './src/input/kws.txt' });
    const { updatedData, clusters } = await this.clusterizerRepository.clusterize({ keywords });
    await this.fileRepository.createFile({ mode });

    const clusterPromises = clusters.map(async (cluster, i) => {
      let clusterName;
      const pointPromises = [];

      for (let index = 0; index < cluster.length; index++) {
        const pointIndex = cluster[index];

        if (index === 0) {
          clusterName = updatedData[pointIndex].query;
          if (mode === 'logs') {
            console.log(`\n${clusterName}:`);
          }
        }

        if (mode === 'logs') {
          console.log(`  - ${updatedData[pointIndex].query}`);
        } else {
          const filePath = mode === 'csv' ? './src/output/out.csv' : './src/output/out.txt';
          const data = `${clusterName},${updatedData[pointIndex].query}\n`;
          pointPromises.push(this.fileRepository.appendFile({ path: filePath, data }));
        }
      }

      await Promise.all(pointPromises);
    });

    await Promise.all(clusterPromises);

    // Handle noise points (not assigned to any cluster)
    const noise = clusters
      .flat()
      .filter((_, index) => !clusters.some(cluster => cluster.includes(index)));

    if (noise.length > 0 && mode === 'logs') {
      console.log('Noise:');
    }

    const noisePromises = noise.map(async pointIndex => {
      if (mode === 'logs') {
        console.log(`  - ${updatedData[pointIndex].query}`);
      } else {
        const filePath = mode === 'csv' ? './src/output/out.csv' : './src/output/out.txt';
        const data = `Noise,${updatedData[pointIndex].query}\n`;
        await this.fileRepository.appendFile({ path: filePath, data });
      }
    });

    await Promise.all(noisePromises);
  }


  async _formatTextFile({ path }) {
    const textData = await this.fileRepository.readTextFile({ path })
    return textData.split('\n');
  }
}