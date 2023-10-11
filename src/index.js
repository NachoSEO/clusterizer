import clusterizerCommand from './providers/providers.js';

const [, , mode] = process.argv;

clusterizerCommand.execute({ mode });