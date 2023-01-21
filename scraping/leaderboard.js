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

export async function getLeaderBoard($) {
  const $rows = $('main section div a');

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
    leaderboard.push({
      ...leaderboardForTeam,
      link: $el.attr('href'),
      image: $el.text(),
    });
  });
  const filtered = leaderboard.filter(l => !!l.title);
  return filtered;
}
