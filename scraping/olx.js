const SELECTORS = {
  title: {selector: '.property-list-title', typeOf: 'string'},
  description: {selector: '.property-description', typeOf: 'string'},
  configuration: {selector: '.property-features', typeOf: 'string'},
  rentValue: {selector: '.property-price', typeOf: 'string'},
};

export async function getOlx($, city) {
  const $rows = $('div.css-oukcj3');
  console.log($rows.length);

  const leaderBoardSelectorEntries = Object.entries(SELECTORS);

  const leaderboard = [];

  $rows.each((index, el) => {
    const $el = $(el);
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, {selector, typeOf, auxSelector}]) => {
      const rawValue = $el.find(selector).text();
      const cleanedValue = rawValue.trim();
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;
      return [key, value];
    });
    const leaderboardForTeam = Object.fromEntries(leaderBoardEntries);
    const link = $el.find('.property-list-title a').attr('href');
    const style = $el.find('.property-media .swiper-wrapper').attr('style');
    const parts = style?.split('https');
    const partImg = parts?.length >= 2 ? parts[1] : '';
    const imageUrl = partImg && partImg?.split(')')[0];
    const text = $el.find('script').text();
    const valueParts = leaderboardForTeam.rentValue.split(' ');
    const value = valueParts[0];

    leaderboard.push({
      ...leaderboardForTeam,
      rentValue: value.replace(/\./g, ''),
      city,
      link,
      image: `https${imageUrl}`,
      json: text.trim(),
    });
  });

  return leaderboard;
}

export function buildUrlOlx(city) {
  const query = city.replace(/-/g, '');
  return `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/${query}/?search%5Border%5D=filter_float_price:asc`;
}
// https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/vilareal/
// https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/castelobranco-castelobranco/?search%5Border%5D=filter_float_price:asc
