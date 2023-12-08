const { fetchWikipediaData } = require('../content_fetcher/wikipedia');

describe('fetchWikipediaData', () => {
  it('should return exact number of results specified by num_records', async () => {
    const num_records = 5;
    const results = await fetchWikipediaData('quantum physics', num_records);

    expect(results).toHaveLength(num_records);

    results.forEach((result) => {
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
    });
  });

  it('should return 10 results for valid keyword when num_records is set to 10', async () => {
    const num_records = 10;
    const results = await fetchWikipediaData('quantum physics', num_records);

    expect(results).toHaveLength(10);

    results.forEach((result) => {
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
    });
  });

  it('should return less than num_records for a less common keyword', async () => {
    const num_records = 7;
    const results = await fetchWikipediaData('some uncommon term', num_records);

    expect(results.length).toBeLessThanOrEqual(num_records);
  });

  it('should handle invalid keyword with no results', async () => {
    const results = await fetchWikipediaData('thisisnotavalidkeyword', 5);
    expect(results).toHaveLength(0);
  });

  it('should handle negative num_records gracefully', async () => {
    const results = await fetchWikipediaData('quantum physics', -1);
    expect(results).toHaveLength(0);
  });

  it('should handle excessively large num_records gracefully', async () => {
    const results = await fetchWikipediaData('quantum physics', 10000);
    expect(results.length).toBeLessThanOrEqual(1000);
  });

  it('should handle network errors gracefully', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Network error')),
    );

    const results = await fetchWikipediaData('quantum physics', 5);
    expect(results).toHaveLength(0);

    global.fetch.mockRestore();
  });
});
