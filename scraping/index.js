import {readDBFile, writeDBFile} from '../db/index.js';
import {getLeaderBoard} from './leaderboard.js';
import {logError, logInfo, logSuccess} from './log.js';
import {buildUrlSupercasa, getSupercasa} from './supercasa.js';
import {scrapeAndSave} from './utils.js';

const scrapeParameter = process.argv.at(-1);
const cities = await readDBFile('cities');

const SCRAPINGS = {
  supercasa: {
    scrape: getSupercasa,
    url: buildUrlSupercasa,
  },
};

const buildURlToScrape = city => {
  if (SCRAPINGS[scrapeParameter]) {
    return SCRAPINGS[scrapeParameter].url(city);
  } else {
    const baseUrl = 'https://www.uniplaces.com/accommodation';
    return `${baseUrl}/${city}?guests=3&move-in=2023-05-16&order=price_asc&rent-type[]=property`;
  }
};

logInfo('Scraping all data...');
const scrap = SCRAPINGS[scrapeParameter];
const contentAll = [];
const start = performance.now();
const file = scrap ? scrapeParameter : 'leaderboard';
try {
  for (const city of cities.slice(0, 1)) {
    const url = buildURlToScrape(city);
    logInfo(`Scraping [${city}]...`);
    logInfo(`Scraping [${url}]...`);

    const $ = await scrapeAndSave(url);
    const getData = scrap ? scrap.scrape : getLeaderBoard;
    const content = await getData($, city);
    logSuccess(`[${city}] scraped successfully [${content.length}]`);
    contentAll.push(content);
  }

  logInfo(`Writing [${file}] to database...`);
  const contentFlat = contentAll.flat();
  await writeDBFile(file, contentFlat);
  logSuccess(`[${file}] written successfully`);
} catch (e) {
  logError(`Error scraping [${file}]`);
  logError(e);
} finally {
  const end = performance.now();
  const time = (end - start) / 1000;
  logInfo(`[${file}] scraped in ${time} seconds`);
}
