import fs from 'fs';
import EventEmitter from 'events';

import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { stemmer } from 'stemmer';
import { extract, numbers, words } from 'words-n-numbers';
import { eng, removeStopwords, spa } from 'stopword';
import { DBSCAN } from 'density-clustering';

import keywords from '../input/kws.js'

import ClusterizerCommand from '../commands/ClusterizerCommand.js'

import ClusterizerService from '../services/ClusterizerService.js'

import ClusterizerRepository from '../repositories/ClusterizerRepository.js';
import FileRepository from '../repositories/FileRepository.js';

import LoadingListener from '../listeners/LoadingListerner.js';

const loadingEventEmitter = new EventEmitter()
const loadingListener = new LoadingListener({ loadingEventEmitter });
loadingListener.twirlLoadingEffect();

export default new ClusterizerCommand({
  clusterizerService: new ClusterizerService({
    clusterizerRepository: new ClusterizerRepository({
      dbscan: new DBSCAN(),
      use,
      stemmer,
      extract,
      numbers,
      words,
      eng,
      removeStopwords,
      spa
    }),
    fileRepository: new FileRepository({
      fs
    }),
    keywords
  }),
  loadingEventEmitter
});