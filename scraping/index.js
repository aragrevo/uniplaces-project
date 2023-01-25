import {readDBFile, writeDBFile} from '../db/index.js';
import {getLeaderBoard} from './leaderboard.js';
import {logError, logInfo, logSuccess} from './log.js';
import {getSupercasa} from './supercasa.js';
import {scrapeAndSave} from './utils.js';

//

const scrapeParameter = process.argv.at(-1);
const cities = await readDBFile('cities');

logInfo('Scraping all data...');
if (scrapeParameter === 'supercasa') {
  const start = performance.now();
  const contentAll = [];
  try {
    for (const city of cities) {
      const query = city === 'lisbon' ? 'lisboa' : city;
      const url = `https://supercasa.pt/arrendar-casas/${query}-distrito?ordem=preco-asc`;
      logInfo(`Scraping [${city}]...`);
      logInfo(`Scraping [${url}]...`);
      const $ = await scrapeAndSave(url);
      const content = await getSupercasa($, city);
      logSuccess(`[${city}] scraped successfully [${content.length}]`);
      contentAll.push(content);
    }
    logInfo(`Writing [${scrapeParameter}] to database...`);
    const contentFlat = contentAll.flat();
    await writeDBFile(scrapeParameter, contentFlat);
    logSuccess(`[${scrapeParameter}] written successfully`);
  } catch (e) {
    logError(`Error scraping [${scrapeParameter}]`);
    logError(e);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`[${scrapeParameter}] scraped in ${time} seconds`);
  }
} else {
  const baseUrl = 'https://www.uniplaces.com/accommodation';
  const contentAll = [];

  const start = performance.now();
  try {
    for (const city of cities) {
      const url = `${baseUrl}/${city}?guests=3&move-in=2023-05-16&order=price_asc&rent-type[]=property`;

      logInfo(`Scraping [${city}]...`);
      logInfo(`Scraping [${url}]...`);

      const $ = await scrapeAndSave(url);
      const content = await getLeaderBoard($, city);
      logSuccess(`[${city}] scraped successfully [${content.length}]`);
      contentAll.push(content);
    }

    logInfo(`Writing [Uniplaces] to database...`);
    const contentFlat = contentAll.flat();
    await writeDBFile('leaderboard', contentFlat);
    logSuccess(`[Uniplaces] written successfully`);
  } catch (e) {
    logError(`Error scraping [Uniplaces]`);
    logError(e);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`[Uniplaces] scraped in ${time} seconds`);
  }
}
