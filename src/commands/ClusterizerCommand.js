export default class ClusterizerCommand {
  constructor({ clusterizerService, loadingEventEmitter }) {
    this.clusterizerService = clusterizerService;
    this.loadingEventEmitter = loadingEventEmitter;
  }

  async execute({ mode }) {
    await this.clusterizerService.execute({ mode })
    this.loadingEventEmitter.emit('loadingComplete');
  }
}