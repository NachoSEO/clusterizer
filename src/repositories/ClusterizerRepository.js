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
    const data = await this._steamizer({ keywords });
    const stems = this._extractStemmedKeywords({ data });

    // Load the Universal Sentence Encoder model
    const model = await this.use.load();

    // Convert keywords to embeddings (numeric representation) asynchronously
    const embeddingsPromises = stems.map(stem => model.embed(stem));
    const embeddings = await Promise.all(embeddingsPromises);

    // Convert tensors to arrays
    const embeddingsArray = embeddings.map(embedding => embedding.arraySync());

    // Perform clustering using DBSCAN
    const clusters = this.dbscan.run(embeddingsArray.flat(), eps, minPoints); 

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

    const resultPromises = keywordsWithoutStopWords.map(async (query) => {
      const tokens = await this.extract(query, {
        regex: includeNumbers
          ? [this.words, this.numbers]
          : [this.words],
        toLowercase: true,
      });

      const stems = tokens
        ?.map((tokenizedWord) => this.stemmer(tokenizedWord))
        .sort()
        .join(' ') || '';

      return {
        query,
        tokens,
        stem: stems,
      };
    });

    const result = await Promise.all(resultPromises);

    return result;
  }
}