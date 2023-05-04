export function buildUrlAirbnb(city) {
  const query = city === 'lisbon' ? 'lisboa' : city;
  return `https://www.airbnb.es/s/${city}--Portugal/homes?adults=2&children=1&query=${city}%2C%20Portugal&checkin=2023-05-30&checkout=2023-06-08&price_max=600`;
}

export async function getAirbnb($, city) {
  const $rows = $('script#data-deferred-state');
  console.log($rows.length);
  const leaderboard = [];
  $rows.each((index, el) => {
    const $el = $(el);
    const text = $el.text();
    const json = JSON.parse(text);
    const item = json.niobeMinimalClientData[0];
    const places = !item
      ? []
      : item[1].data.presentation.explore.sections.sectionIndependentData.staysMapSearch.mapSearchResults.map(p => ({
          ...p.listing,
          ...p.pricingQuote,
        }));
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
        link: `https://www.airbnb.es/rooms/${id}?source_impression_id=p3_1683219831_0Pqq5IlrIalwkYYn&check_in=2023-05-30&guests=3&adults=2&check_out=2023-06-08&children=1`,
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