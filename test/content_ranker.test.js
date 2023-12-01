const {
  generateRelatedWords,
  countWordOccurrences,
  // scoreContent,
  // rankContents,
  // getTopContent,
  getEmbeddings,
  cosineSimilarity,
  combinedScore,
} = require('../content_ranker/content_ranker.js');

// Mocking OpenAIEmbeddings and OpenAI methods
jest.mock('langchain/embeddings/openai', () => {
  return {
    OpenAIEmbeddings: jest.fn().mockImplementation(() => {
      return {
        embedQuery: jest.fn().mockResolvedValue(new Array(1536).fill(0.1)), // Adjusted mock response
      };
    }),
  };
});

jest.mock('langchain/llms/openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        predict: jest.fn().mockResolvedValue('love, joy, happiness, affection, elation'),
      };
    }),
  };
});

describe('Testing functions from content_ranker.js', () => {
  test('generateRelatedWords function', async () => {
    const result = await generateRelatedWords('love, happiness, joy');
    expect(result.originalWords).toEqual(['love', 'happiness', 'joy']);
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

  test('combinedScore function', async () => {
    // No need to redefine the mock here since it's already defined at the top
    const content = 'This is a test content.';
    const preferencesVector = new Array(1536).fill(0.2);
    const generatedWords = ['test'];

    const score = await combinedScore(content, preferencesVector, generatedWords);
    expect(score).toBeDefined();
  });

  test('getTopContent function', async () => {
    // ... your existing test for getTopContent ...
  });
});
