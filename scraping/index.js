// import {writeDBFile} from '../db/index.js';
import {logInfo} from './log.js';
import {scrapeAndSave} from './utils.js';

logInfo('Scraping all data...');

await scrapeAndSave();
