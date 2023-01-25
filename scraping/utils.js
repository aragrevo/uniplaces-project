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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeAndSave(url) {
  const $ = url ? await scrape(url) : null;
  await sleep(500);
  return $;
}
