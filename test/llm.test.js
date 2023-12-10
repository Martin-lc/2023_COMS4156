const {
  summarizeText,
  atomChat,
  summarizePubmedOutput,
  summarizeWikipediaOutput,
} = require('../content_optimizer/llm');

// Mocking the OpenAI class
jest.mock('langchain/llms/openai', () => {
  const mockCall = jest.fn().mockResolvedValue('Mocked OpenAI response');
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return { call: mockCall };
    }),
    summarizeText: jest.fn().mockResolvedValue('Mocked summary response'),
  };
});

// Mocking the external modules to avoid actual API calls during testing
jest.mock('../content_fetcher/pubmed');
jest.mock('../content_fetcher/wikipedia');

describe('LLM Module Tests', () => {
  // Test for atomChat
  describe('atomChat', () => {
    it('should return a string response', async () => {
      const result = await atomChat('Tell me a joke');
      expect(typeof result).toBe('string');
    });

    it('should throw an error for empty input', async () => {
      await expect(atomChat('')).rejects.toThrow('Input text cannot be empty.');
    });
  });

  // Test for summarizeText
  describe('summarizeText', () => {
    it('should throw an error for empty input', async () => {
      await expect(summarizeText('')).rejects.toThrow('Input text cannot be empty.');
    });

    it('should handle valid input', async () => {
      const result = await summarizeText('Sample text');
      expect(typeof result).toBe('object');
      expect(result.call).toBe('Mocked OpenAI response');
    });

    it('should handle valid input with maxLength', async () => {
      // Set up a mock maxLength value
      const mockMaxLength = 100;

      // Mocked response for testing maxLength handling
      jest.mock('../content_optimizer/llm', () => {
        return {
          ...jest.requireActual('../content_optimizer/llm'),
          summarizeText: jest.fn((text, maxLength) => {
            if (maxLength) {
              return Promise.resolve(`Mocked summary response within ${maxLength} characters`);
            }
            return Promise.resolve('Mocked summary response');
          }),
        };
      });

      const result = await summarizeText('Sample text', mockMaxLength);

      // Check if the result includes the maxLength constraint
      expect(result).toContain(`within ${mockMaxLength} characters`);
    });
  });

  // Test for summarizePubmedOutput
  describe("summarizePubmedOutput", () => {
    it("should throw an error for invalid input (not an array)", async () => {
      await expect(summarizePubmedOutput("invalid input")).rejects.toThrow("Invalid input. Expected an array of PubMed data.");
    });

    it("should handle valid pubmedData and return summarized results", async () => {
      const validPubmedData = [['Article 1 content.'], ['Article 2 content.']];
      const result = await summarizePubmedOutput(validPubmedData);
      expect(result.length).toBe(validPubmedData.length);
      result.forEach((res) => {
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('source', 'pubmed');
        expect(res).toHaveProperty('content.call', 'Mocked OpenAI response');
      });
    });

    it("should throw an error for non-string or untrimmable text in pubmedData", async () => {
      // Example of invalid data: non-string and empty string
      const invalidPubmedData = [[123, ' '], ['Valid content']];

      // Expect an error to be thrown for the first invalid element (index 0)
      await expect(summarizePubmedOutput(invalidPubmedData))
        .rejects
        .toThrow('Invalid text in PubMed data at index 0');
    });
  });
});

// Test for summarizeWikipediaOutput
describe("summarizeWikipediaOutput", () => {
  it("should throw an error for invalid input (not an array)", async () => {
    await expect(summarizeWikipediaOutput("invalid input")).rejects.toThrow("Invalid input. Expected an array of Wikipedia data.");
  });

  it("should handle valid wikipediaData and return summarized results", async () => {
    // Mock wikipediaData
    const validWikipediaData = [
      { title: 'Article 1', content: 'Content of Article 1' },
      { title: 'Article 2', content: 'Content of Article 2' }
    ];

    // Mock summarizeText to return a string
    jest.mock('../content_optimizer/llm', () => {
      return {
        ...jest.requireActual('../content_optimizer/llm'),
        summarizeText: jest.fn().mockResolvedValue('Mocked summary response'),
      };
    });

    const result = await summarizeWikipediaOutput(validWikipediaData);

    // Check if the length of the result matches the input data length
    expect(result.length).toBe(validWikipediaData.length);

    // Check if the structure of the result is as expected
    result.forEach((res, index) => {
      expect(res.title).toBe(validWikipediaData[index].title);
      expect(res.source).toBe('wikipedia');
      expect(res.content).toBe('Mocked summary response');
    });
  });
});