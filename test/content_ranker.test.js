const {
    countWordOccurrences,
    cosineSimilarity
} = require('../content_ranker/content_ranker.js');


function mockApiSuccess() {
    jest.mock("langchain/embeddings/openai", () => ({
        OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
            embedQuery: jest.fn().mockResolvedValue(new Array(1536).fill(0.1))
        }))
    }));
    jest.mock("langchain/llms/openai", () => ({
        OpenAI: jest.fn().mockImplementation(() => ({
            predict: jest.fn().mockResolvedValue("love, joy, happiness, affection, elation")
        }))
    }));
}

function mockApiFailure() {
    jest.mock("langchain/embeddings/openai", () => ({
        OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
            embedQuery: jest.fn().mockRejectedValue(new Error("API failure"))
        }))
    }));
    jest.mock("langchain/llms/openai", () => ({
        OpenAI: jest.fn().mockImplementation(() => ({
            predict: jest.fn().mockRejectedValue(new Error("API failure"))
        }))
    }));
}

describe("Testing functions from content_ranker.js", () => {
    // Mocking OpenAIEmbeddings and OpenAI methods

    mockApiSuccess()
    const {
        generateRelatedWords,
        getTopContent,
        getEmbeddings,
        combinedScore
    } = require('../content_ranker/content_ranker.js');
    test("generateRelatedWords function", async () => {
        const result = await generateRelatedWords("love, happiness, joy");
        expect(result.originalWords).toEqual(["love", "happiness", "joy"]);
    });


    test('countWordOccurrences function', () => {
        const count = countWordOccurrences('love', 'I love coding and love testing');
        expect(count).toBe(2);
    });

    test('getEmbeddings function', async () => {
        const embeddings = await getEmbeddings('example text');
        expect(embeddings).toHaveLength(1536); // Checking if the embeddings array length is 1536
    });

    test('cosineSimilarity function', () => {
        const vecA = [1, 0, 0];
        const vecB = [0, 1, 0];
        const similarity = cosineSimilarity(vecA, vecB);
        expect(similarity).toBeCloseTo(0);
    });


    test("combinedScore function", async () => {
        // No need to redefine the mock here since it's already defined at the top
        const content = "This is a test content.";
        const preferencesVector = new Array(1536).fill(0.2);
        const generatedWords = ["test"];

        const score = await combinedScore(content, preferencesVector, generatedWords);
        expect(score).toBeDefined();
    });
    test("getTopContent function", async () => {
        const preferences = "love, joy, happiness, excitement";
        const contents = [
            "Content with love and happiness",
            "Content with joy and excitement",
            "Neutral content without specific preferences"];
        let topContent = await getTopContent(preferences, contents);
        expect(topContent).toMatch(/love|joy/);

    });
});

describe("Tests with simulated API failures", () => {
    beforeEach(() => {
        mockApiFailure();

        // Re-import modules for failure tests
        jest.resetModules();
        const failureTestModules = require('../content_ranker/content_ranker.js');
        global.generateRelatedWords = failureTestModules.generateRelatedWords;
        global.scoreContent = failureTestModules.scoreContent;
        global.rankContents = failureTestModules.rankContents;
        global.getTopContent = failureTestModules.getTopContent;
        global.getEmbeddings = failureTestModules.getEmbeddings;
        global.combinedScore = failureTestModules.combinedScore;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    //  generateRelatedWords function handling API failure
    test("generateRelatedWords function handles API failure", async () => {
        const result = await generateRelatedWords("love, happiness, joy");
        console.log(result)
        expect(result.generatedWords).toEqual(["love", "happiness", "joy"]); // Should return original words as fallback
    });

    //  combinedScore function handling API failure
    test("combinedScore function handles API failure", async () => {
        const content = "This is a test content with love and joy.";
        const preferencesVector = await getEmbeddings("love, joy");
        const generatedWords = ["love", "joy"];

        const score = await combinedScore(content, preferencesVector, generatedWords);
        expect(score).toBeDefined();
    });

    //  rankContents function handling API failure
    test("rankContents function handles API failure", async () => {
        const contents = ["Content with love", "Content with joy and love", "Neutral content"];
        const preferencesVector = await getEmbeddings("love, joy");
        const generatedWords = ["love", "joy"];

        const ranked = await rankContents(contents, preferencesVector, generatedWords);
        expect(ranked).toHaveLength(contents.length);
        expect(ranked[0].content).toContain("joy and love"); // Assuming "love" has the highest occurrence
    });


});
