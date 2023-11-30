async function fetchWikipediaData(keywords, num_records = 5) {
    console.log("fetching wikipedia content...")
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keywords)}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const pageIds = searchData.query.search.slice(0, num_records).map(result => result.pageid).join('|');

    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageIds}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const pages = contentData.query.pages;
    const results = [];


    for (const pageId in pages) {
        results.push({
            title: pages[pageId].title,
            content: pages[pageId].extract
        });
    }
    console.log("Done")
    return results;
}

module.exports = {
    fetchWikipediaData
};