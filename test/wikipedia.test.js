const { fetchWikipediaData } = require('../content_fetcher/wikipedia');

describe('fetchWikipediaData', () => {
    it('should return exact number of results specified by num_records', async () => {
        const num_records = 5;
        const results = await fetchWikipediaData('quantum physics', num_records);
        
        expect(results).toHaveLength(num_records);

        results.forEach(result => {
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('content');
        });
    });

    it('should return 10 results for valid keyword when num_records is set to 10', async () => {
        const num_records = 10;
        const results = await fetchWikipediaData('quantum physics', num_records);
        
        expect(results).toHaveLength(10);

        results.forEach(result => {
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('content');
        });
    });

    it('should return less than num_records for a less common keyword', async () => {
        const num_records = 7;
        const results = await fetchWikipediaData('some uncommon term', num_records);

        expect(results.length).toBeLessThanOrEqual(num_records);
    });

});
