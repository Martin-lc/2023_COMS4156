async function fetchWikipediaData(keywords, num_records = 5) {
  console.log('fetching wikipedia content...');

  if (num_records <= 0) {
    console.log('Invalid number of records requested');
    return [];
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keywords)}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      console.log('No results found');
      return [];
    }

    const pageIds = searchData.query.search.slice(0, num_records).map((result) => result.pageid).join('|');

    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageIds}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const pages = contentData.query.pages;
    const results = [];

    for (const pageId in pages) {
      results.push({
        title: pages[pageId].title,
        content: pages[pageId].extract,
      });
    }
    console.log('Done');
    return results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

module.exports = {
  fetchWikipediaData,
};
