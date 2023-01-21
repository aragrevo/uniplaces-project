import * as cheerio from 'cheerio';
import {writeDBFile} from '../db/index.js';
import {getLeaderBoard} from './leaderboard.js';
import {logError, logInfo, logSuccess} from './log.js';

export const cleanText = text =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .replace(/Available from/g, '')
    .trim();

export async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

export async function scrapeAndSave() {
  const start = performance.now();
  const url = 'https://www.uniplaces.com/accommodation/porto?guests=3&move-in=2023-05-16&order=price_asc';
  try {
    logInfo(`Scraping [LeaderBoard]...`);
    const $ = url ? await scrape(url) : null;
    const content = await getLeaderBoard($);
    logSuccess(`[LeaderBoard] scraped successfully`);

    logInfo(`Writing [LeaderBoard] to database...`);
    await writeDBFile('leaderboard', content);
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
