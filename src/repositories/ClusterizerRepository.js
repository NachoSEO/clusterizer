export default class ClusterizerRepository {
  constructor({
    steamizer,
    dbscan,
    use,
    stemmer,
    extract,
    numbers,
    words,
    eng,
    removeStopwords,
    spa
  }) {
    this.steamizer = steamizer;
    this.dbscan = dbscan;
    this.use = use;
    this.stemmer = stemmer;
    this.extract = extract;
    this.numbers = numbers;
    this.words = words;
    this.eng = eng;
    this.removeStopwords = removeStopwords;
    this.spa = spa;
  }

  async clusterize({ keywords, eps = 0.3, minPoints = 2 }) {
    const data = await this._steamizer({ keywords })
    const stems = this._extractStemmedKeywords({ data })

    // Load the Universal Sentence Encoder model
    const model = await this.use.load();

    // Convert keywords to embeddings (numeric representation)
    const embeddings = await model.embed(stems);
    const embeddingsArray = embeddings.arraySync();

    // Perform clustering using DBSCAN
    const clusters = this.dbscan.run(embeddingsArray, eps, minPoints);

    const updatedData = data.map((item, index) => {
      const clusterIndex = clusters.findIndex(cluster => cluster.includes(index));
      return { ...item, cluster: clusterIndex === -1 ? 'Noise' : `Cluster ${clusterIndex + 1}` };
    });

    return { updatedData, clusters };
  }

  _extractStemmedKeywords({ data }) {
    return data.map(item => item.stem);
  }

  async _steamizer({
    keywords,
    langStopWords = 'eng',
    includeNumbers = false,
  }) {
    const stopwords = langStopWords === 'eng' ? this.eng : this.spa;
    const keywordsWithoutStopWords = this.removeStopwords(
      keywords,
      stopwords
    );

    const result = keywordsWithoutStopWords.map((query) => {
      const tokens = this.extract(query, {
        regex: includeNumbers
          ? [this.words, this.numbers]
          : [this.words],
        toLowercase: true,
      });
      return {
        query,
        tokens,
        stem:
          tokens
            ?.map((tokenizedWord) => this.stemmer(tokenizedWord))
            .sort()
            .join(' ') || '',
      };
    });

    return result;
  }
}