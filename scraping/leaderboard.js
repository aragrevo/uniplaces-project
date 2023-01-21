import {cleanText} from './utils.js';

const LEADERBOARD_SELECTORS = {
  rentBy: {selector: '.property__rent-by', typeOf: 'string'},
  title: {selector: '.property__title', typeOf: 'string'},
  configuration: {selector: '.property__configuration', typeOf: 'string'},
  neighbourHood: {selector: '.property__neighbourhood', typeOf: 'string'},
  rentValue: {selector: '.rent .rent__value', typeOf: 'string'},
  rentFrequency: {selector: '.rent__frequency', typeOf: 'string'},
  billsIncluded: {selector: '.bills-included', typeOf: 'string'},
  offerAvailability: {selector: '.offer__availability', typeOf: 'string'},
};

export async function getLeaderBoard($, city) {
  const $rows = $('main section div a');
  console.log($rows.length);

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((index, el) => {
    const $el = $(el);
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, {selector, typeOf}]) => {
      const rawValue = $el.find(selector).text();
      const cleanedValue = cleanText(rawValue);

      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });
    const leaderboardForTeam = Object.fromEntries(leaderBoardEntries);
    const link = $el.attr('href');
    const parts = $el.text()?.split('https');
    const partImg = parts.length >= 2 ? parts[2] : '';
    const imageUrl = partImg.split('&')[0];
    leaderboard.push({
      ...leaderboardForTeam,
      city,
      rentValue: leaderboardForTeam.rentValue.replace(/\,/g, ''),
      link,
      image: `https${imageUrl}`,
      text: $el.text(),
    });
  });
  const filtered = leaderboard.filter(l => !!l.title);
  return filtered;
}
