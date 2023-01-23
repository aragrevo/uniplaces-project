import * as cheerio from 'cheerio';
import {writeDBFile} from '../db/index.js';
import {getLeaderBoard} from './leaderboard.js';
import {logError, logInfo, logSuccess} from './log.js';

export const cleanText = text =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .replace(/Available from/g, '')
    .replace(/€/g, '')
    .trim();

export async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

const baseUrl = 'https://www.uniplaces.com/accommodation';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeAndSave(cities) {
  const start = performance.now();
  const contentAll = [];
  try {
    for (const city of cities) {
      const url = `${baseUrl}/${city}?guests=3&move-in=2023-05-16&order=price_asc&rent-type[]=property`;

      logInfo(`Scraping [${city}]...`);
      logInfo(`Scraping [${url}]...`);
      const $ = url ? await scrape(url) : null;
      await sleep(500);
      const content = await getLeaderBoard($, city);
      logSuccess(`[${city}] scraped successfully [${content.length}]`);
      contentAll.push(content);
    }

    logInfo(`Writing [LeaderBoard] to database...`);
    const contentFlat = contentAll.flat();
    await writeDBFile('leaderboard', contentFlat);
    logSuccess(`[LeaderBoard] written successfully`);
  } catch (e) {
    logError(`Error scraping [LeaderBoard]`);
    logError(e);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`[LeaderBoard] scraped in ${time} seconds`);
  }
}
