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

## Output
### Modes
There are three different output modes:
* logs: Run `pnpm run logs` and the output will be printed in the console
* csv: Run `pnpm run csv` and the output will be safe as a csv in `out.csv`
* text: Run `pnpm run txt` and the output will be safe as a txt in `out.txt`

Logs example:
```sh
9app:
  - 9app
  - 9apps

adobe flash player descargar:
  - adobe flash player descargar
  - descargar adobe flash player

among us download pc:
  - among us download pc
  - among us pc download

anydesk descargar:
  - anydesk descargar
  - descargar anydesk

anydesk download:
  - anydesk download
  - download anydesk

anydesk download free:
  - anydesk download free
  - anydesk free download
```

To have the output in a file you can use this shell command
```sh
node ./src/index.js > out.txt
```

The output will display the updated data with cluster assignments and a list of clusters with their corresponding keywords. The output will also display any noise points that were not assigned to any cluster.

Note: This is the MVP version of the clusterizer

## License
This code is licensed under the MIT license. See the LICENSE file for more details