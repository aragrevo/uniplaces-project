import {cleanText} from './utils.js';

const LEADERBOARD_SELECTORS = {
  rentBy: {selector: '.property__rent-by', typeOf: 'string', auxSelector: ''},
  title: {selector: '.property__title', typeOf: 'string', auxSelector: '.lmSDwb'},
  configuration: {selector: '.property__configuration', typeOf: 'string', auxSelector: '.jOrvwj'},
  neighbourHood: {selector: '.property__neighbourhood', typeOf: 'string', auxSelector: ''},
  rentValue: {selector: '.rent .rent__value', typeOf: 'string', auxSelector: '.SCYSn'},
  rentFrequency: {selector: '.rent__frequency', typeOf: 'string', auxSelector: ''},
  billsIncluded: {selector: '.bills-included', typeOf: 'string', auxSelector: '.dKcKqq'},
  offerAvailability: {selector: '.offer__availability', typeOf: 'string', auxSelector: '.fMhaQc'},
};

export async function getLeaderBoard($, city) {
  const $rows = $('main section div a');
  console.log($rows.length);

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((index, el) => {
    const $el = $(el);
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, {selector, typeOf, auxSelector}]) => {
      const firstValue = $el.find(selector).text();
      const rawValue = firstValue.length > 2 ? firstValue : $el.find(auxSelector).text();
      const cleanedValue = cleanText(rawValue);

      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });
    const leaderboardForTeam = Object.fromEntries(leaderBoardEntries);
    const link = $el.attr('href');
    const parts = $el.text()?.split('https');
    const partImg = parts.length >= 2 ? parts[2] : '';
    const imageUrl = partImg.split('&')[0];
    const valueParts = leaderboardForTeam.rentValue.split(' ');
    const rawValue = valueParts.length === 1 ? valueParts[0] : valueParts[1];
    const rawValueParts = rawValue.split('/');
    const value = rawValueParts[0];

    leaderboard.push({
      ...leaderboardForTeam,
      city,
      rentValue: value.replace(/\,/g, ''),
      link,
      image: `https${imageUrl}`,
      text: $el.text(),
    });
  });
  const regExp = /^https.+\?$/;
  const filtered = leaderboard.filter(l => regExp.test(l.link));
  return filtered;
}
