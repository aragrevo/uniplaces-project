import {readDBFile} from '../db/index.js';
import {logInfo} from './log.js';
import {scrapeAndSave} from './utils.js';

logInfo('Scraping all data...');

const cities = await readDBFile('cities');
await scrapeAndSave(cities);
