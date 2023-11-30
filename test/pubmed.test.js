const {
  getIDByKeywords,
  getAbstractByID,
  getContentByKeywords,
} = require('../content_fetcher/pubmed');

describe('pubmed API testing', () => {
  const testCases_0 = [
    // contains only keywords
    {keywords: 'health'}];
  testCases_0.forEach(({keywords}) => {
    test(`getIDByKeywords should return an array for keywords: ${keywords} and max_records: 5 even without the max_records argument`, async () => {
      const result = await getIDByKeywords(keywords);
      console.log('keywords: ' + keywords + ' gives result: ' + result);
      expect(result).toBeInstanceOf(Array);
    });

    test(`getContentByKeywords should return an array for keywords: ${keywords} and max_records: 5 even without the max_records argument`, async () => {
      const result = await getContentByKeywords(keywords);
      console.log(
          'keywords: ' +
        keywords +
        ' and max_records: 5' +
        ' gives result: ' +
        result,
      );
      expect(result).toBeInstanceOf(Array);
    });

    // 2nd iteration
    // test(`getContentByKeywords should return an array with length not exceeding max_records for keywords: ${keywords} and max_records: ${max_records}`, async () => {
    //     const result = await getContentByKeywords(keywords, max_records);
    //     expect(result.length).toBeLessThanOrEqual(max_records);
    // });
  });


  const testCases_1 = [
    // Groups of 1
    {keywords: 'fatigue', max_records: 5},

    // Groups of 2
    {keywords: 'diet+balance', max_records: 5},

    // Groups of 3
    {keywords: 'covid+elder+fatigue', max_records: 5},
  ];

  testCases_1.forEach(({keywords, max_records}) => {
    const TIMEOUT = 500; // 1 second wait between each test to not exceed api rate limit per second
    beforeEach(async () => {
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    });

    test(`getIDByKeywords should return an array for keywords: ${keywords} and max_records: ${max_records}`, async () => {
      const result = await getIDByKeywords(keywords, max_records);
      console.log('keywords: ' + keywords + ' gives result: ' + result);
      expect(result).toBeInstanceOf(Array);
    });

    // 2nd iteration
    // test(`getIDByKeywords should return an array with length not exceeding max_records for keywords: ${keywords} and max_records: ${max_records}`, async () => {
    //     const result = await getIDByKeywords(keywords, max_records);
    //     expect(result.length).toBeLessThanOrEqual(max_records);
    // });

    test(`getContentByKeywords should return an array for keywords: ${keywords} and max_records: ${max_records}`, async () => {
      const result = await getContentByKeywords(keywords, max_records);
      console.log(
          'keywords: ' +
        keywords +
        ' and max_records: ' +
        max_records +
        ' gives result: ' +
        result,
      );
      expect(result).toBeInstanceOf(Array);
    });

    // 2nd iteration
    // test(`getContentByKeywords should return an array with length not exceeding max_records for keywords: ${keywords} and max_records: ${max_records}`, async () => {
    //     const result = await getContentByKeywords(keywords, max_records);
    //     expect(result.length).toBeLessThanOrEqual(max_records);
    // });
  });

  const testCases_2 = [
    // single PMID
    {PMID: '37754283'},
  ];

  // to be implemented in 2nd iteration
  // const testCases_3 = [
  //     // Combinations of 2 PMIDs
  //     { PMID: '37822697, 37814964' },
  //     { PMID: '37767276, 37754283' },
  //     { PMID: '37593971, 37544313' },

  //     // Combinations of 3 PMIDs
  //     { PMID: '37539573, 37525234, 37493388' },
  //     { PMID: '37334377, 37323542, 37316637' }
  // ]
  testCases_2.forEach(({PMID}) => {
    test(`getAbstractByID should return an array of abstract paragraphs for PMID: ${PMID}`, async () => {
      const result = await getAbstractByID(PMID);
      console.log('PMID: ' + PMID + ' gives result: ' + result);
      expect(result).toBeInstanceOf(Array);
    });

    // 2nd iteration
    // test(`getAbstractByID should return an array with length equal to the number of PMID for PMID: ${PMID}`, async () => {
    //     const result = await getAbstractByID(PMID);
    //     const elementsArray = PMID.split(',').map(item => item.trim());
    //     const numberOfElements = elementsArray.length;
    //     expect(result).toHaveLength(numberOfElements);
    // });
  });
});
