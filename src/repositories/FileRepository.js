export default class FileRepository {
  constructor({ fs }) {
    this.fs = fs;
  }

  async createFile({ mode }) {
    if (mode === 'csv') {
      await this.fs.promises.writeFile('./src/output/out.csv', '');
    } else if (mode === 'txt') {
      await this.fs.promises.writeFile('../output/out.txt', '');
    }
  }

  async appendFile({ path, data }) {
    await this.fs.promises.appendFile(path, data);
  }

  async readTextFile({ path }) {
    return this.fs.promises.readFile(path, 'utf8');
  }
}