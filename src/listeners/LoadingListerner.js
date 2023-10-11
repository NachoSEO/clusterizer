export default class LoadingListener {
  constructor({ loadingEventEmitter }){
    this.loadingEventEmitter = loadingEventEmitter;
  }

  twirlLoadingEffect() {
    const twirlChars = ['-', '\\', '|', '/'];
    let index = 0;
  
    const interval = setInterval(() => {
      process.stdout.write(`\r${twirlChars[index]} Generating clusters...`);
      index = (index + 1) % twirlChars.length;
    }, 100);
  
    this.loadingEventEmitter.on('loadingComplete', () => {
      clearInterval(interval);
      process.stdout.write('\n'); // Move to the next line after loading is done
      console.log('Task done!')
    });  
  }
}