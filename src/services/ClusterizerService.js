export default class ClusterizerService {
  constructor({ clusterizerRepository, fileRepository, keywords }) {
    this.clusterizerRepository = clusterizerRepository;
    this.fileRepository = fileRepository;
    this.keywords = keywords;
  }

  async execute({ mode }) {
    const { updatedData, clusters } = await this.clusterizerRepository.clusterize({ keywords: this.keywords });
    await this.fileRepository.createFile({ mode })

    // Print clustered keywords
    clusters.forEach((cluster, i) => {
      let clusterName;
      cluster.forEach(async (pointIndex, index) => {
        if(index === 0) {
          clusterName = updatedData[pointIndex].query
          if (mode === 'logs') {
            console.log(`\n${clusterName}:`);
          }
        }

        if (mode === 'logs') {
          console.log(`  - ${updatedData[pointIndex].query}`);
        } else if (mode === 'csv') {
          await this.fileRepository.appendFile({ path: './src/output/out.csv', data: `${clusterName},${updatedData[pointIndex].query}\n` })
        } else if (mode === 'txt') {
          await this.fileRepository.appendFile({ path: './src/output/out.txt', data: `${clusterName},${updatedData[pointIndex].query}\n` })
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
          await this.fileRepository.appendFile({ path: './src/output/out.csv', data: `Noise,${updatedData[pointIndex].query}\n` })
        } else if (mode === 'txt') {
          await this.fileRepository.appendFile({ path: './src/output/out.txt', data: `Noise,${updatedData[pointIndex].query}\n` })
        }
      });
    }
  }
}