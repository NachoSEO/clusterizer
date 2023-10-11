# Universal Sentence Encoder Clustering with DBSCAN
This code provides an implementation of clustering text data using the Universal Sentence Encoder (USE) and the Density-Based Spatial Clustering of Applications with Noise (DBSCAN) algorithm.

You can provide a list of queries (sentences or words) and it will cluster them for your SEO needs (or other use cases) in groups using this NodeJS repo. 

## Requirements
This code requires the following packages to be installed:

* @tensorflow/tfjs-node
* @tensorflow-models/universal-sentence-encoder
* density-clustering

If you run `npm install` or `pnpm install` the repo will install all the necessary dependencies.


## Usage
To run the clustering on your own data, modify the `kws.js` file to contain your desired keywords, then run the script using Node.js:

```js
node ./src/index.js
```

### Output

The return will give you this output:

```sh
[
  {
    query: 'battleground mobile india download',
    tokens: [ 'battleground', 'mobile', 'india', 'download' ],
    stem: 'battleground download india mobil',
    cluster: 'Cluster 9'
  },
  {
    query: 'battlegrounds mobile india downloadable content',
    tokens: [ 'battlegrounds', 'mobile', 'india', 'downloadable', 'content' ],
    stem: 'battleground content download india mobil',
    cluster: 'Cluster 9'
  },
  {
    query: 'beamng drive download',
    tokens: [ 'beamng', 'drive', 'download' ],
    stem: 'beamng download drive',
    cluster: 'Cluster 10'
  },
  {
    query: 'beamng drive free download',
    tokens: [ 'beamng', 'drive', 'free', 'download' ],
    stem: 'beamng download drive free',
    cluster: 'Cluster 10'
  },
  {
    query: 'bijoy bayanno',
    tokens: [ 'bijoy', 'bayanno' ],
    stem: 'bayanno bijoi',
    cluster: 'Noise'
  },
]
```

If you don't modify the code you will see in your terminal the different clusters, like this:

```sh
Cluster 1:
  - 9app
  - 9apps
Cluster 2:
  - adobe flash player descargar
  - descargar adobe flash player
Cluster 3:
  - among us download pc
  - among us pc download
Cluster 4:
  - anydesk descargar
  - descargar anydesk
Cluster 5:
  - anydesk download
  - download anydesk
Cluster 6:
  - anydesk download free
  - anydesk free download
```
### Modes
There are three different output modes:
* logs: Run `pnpm run logs` and the output will be printed in the console
* csv: Run `pnpm run csv` and the output will be safe as a csv in `out.csv`
* text: Run `pnpm run txt` and the output will be safe as a txt in `out.txt`

To have the output in a file you can use this shell command
```sh
node ./src/index.js > out.txt
```

The output will display the updated data with cluster assignments and a list of clusters with their corresponding keywords. The output will also display any noise points that were not assigned to any cluster.

Note: This is the MVP version of the clusterizer

## License
This code is licensed under the MIT license. See the LICENSE file for more details