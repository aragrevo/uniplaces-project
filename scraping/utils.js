import * as cheerio from 'cheerio';

// import {writeFile, readFile} from 'node:fs/promises';
// import path from 'node:path';

// const DB_PATH = path.join(process.cwd(), './db/');

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
  // writeFile(`${DB_PATH}/uniplaces.txt`, html, 'utf-8');
  return cheerio.load(html);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeAndSave(url) {
  const $ = url ? await scrape(url) : null;
  await sleep(500);
  return $;
}
