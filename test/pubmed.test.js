const { getIDByKeywords, getAbstractByID, getContentByKeywords } = require('../content_fetcher/pubmed');


describe('getIDByKeywords', () => {

    const testCases_1 = [
        // Groups of 1
        { keywords: 'health', max_records: 10 },
        { keywords: 'wellness', max_records: 5 },
        { keywords: 'fitness', max_records: 15 },
        { keywords: 'nutrition', max_records: 8 },
        { keywords: 'exercise', max_records: 12 },

        // Groups of 2
        { keywords: 'diet+balance', max_records: 9 },
        { keywords: 'disease+awareness', max_records: 6 },
        { keywords: 'prevention+tips', max_records: 11 },
        { keywords: 'healthcare+industry', max_records: 10 },
        { keywords: 'medical+advice', max_records: 5 },


        // Groups of 3
        { keywords: 'wellbeing+solutions+programs', max_records: 8 },
        { keywords: 'mindfulness+practice+techniques', max_records: 7 },
        { keywords: 'recovery+strategies+plans', max_records: 12 },
        { keywords: 'vitality+boost+energy', max_records: 9 }
    ];

    const testCases_2 = [

        // single PMID
        { PMID: '37539573' },
        { PMID: '37525234' },
        { PMID: '37493388' },
        { PMID: '37453116' },
        { PMID: '37395036' },
        { PMID: '37387358' },
        { PMID: '37334377' },
        { PMID: '37323542' },
        { PMID: '37316637' },

        // Combinations of 2 PMIDs
        { PMID: '37822697, 37814964' },
        { PMID: '37767276, 37754283' },
        { PMID: '37698562, 37698401' },
        { PMID: '37698189, 37688424' },
        { PMID: '37593971, 37544313' },

        // Combinations of 3 PMIDs
        { PMID: '37539573, 37525234, 37493388' },
        { PMID: '37453116, 37395036, 37387358' },
        { PMID: '37334377, 37323542, 37316637' }

    ];


    testCases_1.forEach(({ keywords, max_records }) => {
        test(`getIDByKeywords should return an array for keywords: ${keywords} and max_records: ${max_records}`, async () => {
            const result = await getIDByKeywords(keywords, max_records);
            expect(result).toBeInstanceOf(Array);
        });
        test(`getIDByKeywords should return an array with length not exceeding max_records for keywords: ${keywords} and max_records: ${max_records}`, async () => {
            const result = await getIDByKeywords(keywords, max_records);
            expect(result.length).toBeLessThanOrEqual(max_records);
        });

        test(`getContentByKeywords should return an array for keywords: ${keywords} and max_records: ${max_records}`, async () => {
            const result = await getContentByKeywords(keywords, max_records);
            expect(result).toBeInstanceOf(Array);
        });
        test(`getContentByKeywords should return an array with length not exceeding max_records for keywords: ${keywords} and max_records: ${max_records}`, async () => {
            const result = await getContentByKeywords(keywords, max_records);
            expect(result.length).toBeLessThanOrEqual(max_records);
        });

    });

    testCases_2.forEach(({ PMID }) => {
        test(`getAbstractByID should return an array of abstract paragraphs for PMID: ${PMID}`, async () => {
            const result = await getAbstractByID(PMID);
            expect(result).toBeInstanceOf(Array);
        });
        test(`getAbstractByID should return an array with length equal to the number of PMID for PMID: ${PMID}`, async () => {
            const result = await getAbstractByID(PMID);
            const elementsArray = PMID.split(',').map(item => item.trim());
            const numberOfElements = elementsArray.length;
            expect(result).toHaveLength(numberOfElements);
        });
    });
});