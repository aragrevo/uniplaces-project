import {logError} from './log.js';

function getDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const monthFormatted = month < 10 ? `0${month}` : month;
  return `${now.getFullYear()}-${monthFormatted}-${now.getDate()}`;
}

export const checkin = '2024-03-25';
export const checkout = '2024-03-27';

export function buildUrlAirbnb(city) {
  const query = city === 'lisbon' ? 'lisboa' : city;
  return `https://www.airbnb.es/s/${city}--Portugal/homes?adults=3&children=1&query=${city}%2C%20Portugal&checkin=${checkin}&checkout=${checkout}&price_max=100`;
}

function getPlaces(presentation) {
  try {
    const mapResults =
      presentation?.explore?.sections?.sectionIndependentData?.staysMapSearch ?? presentation.staysSearch.mapResults;
    return mapResults.mapSearchResults.map(p => ({
      ...p.listing,
      ...p.pricingQuote,
    }));
  } catch (error) {
    logError(error);
    return [];
  }
}

export async function getAirbnb($, city) {
  const $rows = $('script#data-deferred-state');
  console.log('hasData: ', $rows.length);
  const leaderboard = [];
  $rows.each((index, el) => {
    const $el = $(el);
    const text = $el.text();
    const json = JSON.parse(text);
    const item = json.niobeMinimalClientData[0];
    // console.log(item[1].data.presentation);
    // console.log(item[1].data.presentation.explore);
    const places = !item ? [] : getPlaces(item[1].data.presentation);
    places.forEach(p => {
      const {
        id,
        localizedCityName,
        name,
        roomTypeCategory,
        title,
        structuredContent,
        contextualPictures,
        structuredStayDisplayPrice,
      } = p;
      const {mapPrimaryLine} = structuredContent;
      const {primaryLine, secondaryLine} = structuredStayDisplayPrice;
      const {price, qualifier} = primaryLine;
      const {price: total} = secondaryLine;
      const parts = price ? encodeURI(price).split('%C2%A0') : ['', ''];
      const parts2 = total ? encodeURI(total).split('%C2%A0') : ['', ''];
      leaderboard.push({
        title: title,
        description: name,
        configuration: roomTypeCategory,
        rentValue: parts2[0]?.replace('.', ''),
        rentDesc: decodeURI(parts2[1]),
        city: localizedCityName,
        link: `https://www.airbnb.es/rooms/${id}?source_impression_id=p3_1683219831_0Pqq5IlrIalwkYYn&check_in=${checkin}&guests=3&adults=2&check_out=${checkout}&children=1`,
        image: contextualPictures[0]?.picture,
        price: parts[0],
        priceCurrency: decodeURI(parts[1]),
        qualifier,
        json: p,
      });
    });
  });

  return leaderboard;
}
