import {readDBFile, writeDBFile} from '../db/index.js';
import {buildUrlAirbnb, getAirbnb} from './airbnb.js';
import {getLeaderBoard} from './leaderboard.js';
import {logError, logInfo, logSuccess} from './log.js';
import {buildUrlOlx, getOlx} from './olx.js';
import {buildUrlSupercasa, getSupercasa} from './supercasa.js';
import {scrapeAndSave} from './utils.js';

const scrapeParameter = process.argv.at(-1);
const cities = await readDBFile('cities');

const SCRAPINGS = {
  supercasa: {
    scrape: getSupercasa,
    url: buildUrlSupercasa,
    filter: 'vila-real',
  },
  airbnb: {
    url: buildUrlAirbnb,
    scrape: getAirbnb,
    filter: 'porto',
  },
  olx: {
    url: buildUrlOlx,
    scrape: getOlx,
  },
};

//
// https://www.airbnb.es/s/Braga--Portugal/homes?checkin=2023-05-17&checkout=2023-05-23&date_picker_type=calendar&adults=2&children=1&search_type=autocomplete_click&tab_id=home_tab&query=Braga%2C%20Portugal&flexible_trip_lengths%5B%5D=one_week&price_filter_input_type=0&price_filter_num_nights=6&channel=EXPLORE&source=structured_search_input_header
const buildURlToScrape = city => {
  if (SCRAPINGS[scrapeParameter]) {
    return SCRAPINGS[scrapeParameter].url(city);
  } else {
    const baseUrl = 'https://www.uniplaces.com/accommodation';
    // return `${baseUrl}/${city}?guests=3&rent-type[]=property`;
    return `${baseUrl}/${city}?guests=3&move-in=${'2024-05-01'}&rent-type[]=property`;
  }
};

logInfo('Scraping all data -----------');
const scrap = SCRAPINGS[scrapeParameter];
const contentAll = [];
const start = performance.now();
const file = scrap ? scrapeParameter : 'leaderboard';
try {
  const citiesToScrap = scrap?.filter ? cities.filter(c => c === scrap.filter) : cities;
  for (const city of citiesToScrap) {
    const url = buildURlToScrape(city);
    logInfo(`Scraping [${city}] -----------`);
    logInfo(`Scraping [${url}] -----------`);

    const $ = await scrapeAndSave(url);
    const getData = scrap ? scrap.scrape : getLeaderBoard;
    const content = await getData($, city);
    logSuccess(`[${city}] scraped successfully [${content.length}]`);
    contentAll.push(content);
  }

  logInfo(`Writing [${file}] to database -----------`);
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
