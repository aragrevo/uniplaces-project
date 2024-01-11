import {cleanText} from './utils.js';

const LEADERBOARD_SELECTORS = {
  title: {selector: '.property__title', typeOf: 'string', auxSelector: '.dNoykB'},
  rentBy: {selector: '.property__rent-by', typeOf: 'string', auxSelector: '.doxuAy'},
  configuration: {selector: '.property__configuration', typeOf: 'string', auxSelector: '.jOrvwj'},
  neighbourHood: {selector: '.property__neighbourhood', typeOf: 'string', auxSelector: ''},
  rentValue: {selector: '.rent .rent__value', typeOf: 'string', auxSelector: '.doxuAy'},
  rentFrequency: {selector: '.rent__frequency', typeOf: 'string', auxSelector: ''},
  billsIncluded: {selector: '.bills-included', typeOf: 'string', auxSelector: '.dKcKqq'},
  offerAvailability: {selector: '.offer__availability', typeOf: 'string', auxSelector: '.fMhaQc'},
};

export async function getLeaderBoard($, city) {
  // const $rows = $('main section.cbcKNZ'); //Grid Items
  const $rows = $('script#__NEXT_DATA__');
  console.log('hasData: ', $rows.length);

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((index, el) => {
    const $el = $(el);
    const text = $el.text();
    const json = JSON.parse(text);
    const places = json.props.pageProps.offers.data;
    // console.log(places);
    places.forEach(p => {
      const {attributes, id} = p;
      const {property, accommodation_offer, photos} = attributes;
      leaderboard.push({
        title: accommodation_offer.title,
        configuration: `${property.number_of_rooms} bedrooms - ${property.number_of_bathrooms} bathrooms - ${accommodation_offer.max_guests} people`,
        city,
        link: `https://www.uniplaces.com/accommodation/${city}/${id}`,
        image: `https://spa-search.uniplaces.com/_next/image?url=https://cdn-static-new.uniplaces.com/property-photos/${photos[0].hash}/small.jpg&w=1920&q=75`,
        price: accommodation_offer.price.amount,
        rentValue: accommodation_offer.price.amount / 100,
        priceCurrency: accommodation_offer.price.currency_code,
        offerAvailability: accommodation_offer.available_from?.split('T')[0],
        billsIncluded: accommodation_offer.all_bills_included,
        neighbourHood: property.neighbourhood?.name ?? '',
        json: p,
      });
    });
  });
  const regExp = /^https.+\?$/;
  const filtered = leaderboard.filter(l => regExp.test(l.link));
  return leaderboard;
}
