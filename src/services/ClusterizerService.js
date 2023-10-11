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
      if (mode === 'logs') {
        console.log(`Cluster ${i + 1}:`);
      }
      cluster.forEach(async pointIndex => {
        if (mode === 'logs') {
          console.log(`  - ${updatedData[pointIndex].query}`);
        } else if (mode === 'csv') {
          await this.fileRepository.appendFile({ path: './src/output/out.csv', data: `Cluster ${i + 1},${updatedData[pointIndex].query}\n` })
        } else if (mode === 'txt') {
          await this.fileRepository.appendFile({ path: './src/output/out.txt', data: `Cluster ${i + 1},${updatedData[pointIndex].query}\n` })
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