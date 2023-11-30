const { getIDByKeywords } = require('../content_fetcher/pubmed');
const { fetchWikipediaData } = require('../content_fetcher/wikipedia');
const fetchMock = require('jest-fetch-mock');


global.fetch = fetchMock;

describe('API Endpoints', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('should fetch pubmed article IDs based on keywords', async () => {
        const keywords = 'health';
        const maxRecords = 2;

        // Mock the API response
        const mockResponse = `
      <IdList>
        <Id>37539573</Id>
        <Id>37525234</Id>
      </IdList>
    `;

        fetchMock.mockResponseOnce(mockResponse, { status: 200 });

        // Simulate the function call
        const result = await getIDByKeywords(keywords, maxRecords);

        // Assert fetch was called with the correct URL
        expect(fetchMock).toHaveBeenCalledWith(
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?term=${keywords}&retmax=${maxRecords}&db=pubmed&retmode=xml`
        );

        // Assert the function returns the expected result
        expect(result).toEqual(['37539573', '37525234']);
    });

    // iteration 2
    // it('should handle API error', async () => {
    //     const keywords = '';
    //     const maxRecords = -1;

    //     // Mock a failed API response
    //     fetchMock.mockResponseOnce('Error', { status: 500 });
    //     await expect(getIDByKeywords(keywords, maxRecords)).rejects.toThrow('Error');
    // });
});

// iteration 2
// describe('API Endpoints', () => {
//     beforeEach(() => {
//         fetchMock.resetMocks();
//     });

//     it('should fetch and format Wikipedia data based on keywords', async () => {
//         const keywords = 'javascript';
//         const numRecords = 2;

//         // Mock search API response
//         const searchApiResponse = {
//             query: {
//                 search: [
//                     { pageid: 1, title: 'JavaScript Basics' },
//                     { pageid: 2, title: 'Advanced JavaScript Concepts' }
//                 ]
//             }
//         };
//         fetchMock.mockResponseOnce(JSON.stringify(searchApiResponse), { status: 200 });

//         // Mock content API response
//         const contentApiResponse = {
//             query: {
//                 pages: {
//                     1: { title: 'JavaScript Basics', extract: 'Introduction to JavaScript' },
//                     2: { title: 'Advanced JavaScript Concepts', extract: 'Advanced JavaScript topics' }
//                 }
//             }
//         };
//         fetchMock.mockResponseOnce(JSON.stringify(contentApiResponse), { status: 200 });

//         // Simulate the function call
//         const result = await fetchWikipediaData(keywords, numRecords);

//         // Assert fetch was called with the correct URLs
//         expect(fetchMock).toHaveBeenCalledTimes(2);
//         expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('srsearch=javascript'), {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' }
//         });
//         expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('pageids=1|2'), {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' }
//         });

//         // Assert the function returns the expected formatted data
//         expect(result).toEqual([
//             { title: 'JavaScript Basics', content: 'Introduction to JavaScript' },
//             { title: 'Advanced JavaScript Concepts', content: 'Advanced JavaScript topics' }
//         ]);
//     });

//     it('should handle API errors', async () => {
//         const keywords = '';
//         const numRecords = -1;

//         // Mock failed search API response
//         fetchMock.mockResponseOnce(JSON.stringify({ error: 'Search API error' }), { status: 500 });
//         await expect(fetchWikipediaData(keywords, numRecords)).rejects.toThrow('Search API error');
//     });
// });
