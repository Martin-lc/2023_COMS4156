const {
    summarizeText,
    atomChat,
    summarizePubmedOutput,
    summarizeWikipediaOutput
} = require('./llm');

// Mocking the external modules to avoid actual API calls during testing
jest.mock('./pubmed');
jest.mock('./wikipedia');

describe("LLM Module Tests", () => {

    // Test for atomChat
    describe("atomChat", () => {
        it("should return a string response", async () => {
            const result = await atomChat("Tell me a joke");
            expect(typeof result).toBe('string');
        });

        it("should throw an error for empty input", async () => {
            await expect(atomChat("")).rejects.toThrow("Input text cannot be empty.");
        });
    });

    // Test for summarizeText
    describe("summarizeText", () => {
        it("should throw an error for empty input", async () => {
            await expect(summarizeText("")).rejects.toThrow("Input text cannot be empty.");
        });
    });

    // Test for summarizePubmedOutput
    describe("summarizePubmedOutput", () => {
        it("should throw an error for invalid inputs", async () => {
            await expect(summarizePubmedOutput("", 2)).rejects.toThrow("Invalid input parameters.");
            await expect(summarizePubmedOutput("dementia+elder", 0)).rejects.toThrow("Invalid input parameters.");
        });
    });

    // Test for summarizeWikipediaOutput
    describe("summarizeWikipediaOutput", () => {
        it("should throw an error for invalid inputs", async () => {
            await expect(summarizeWikipediaOutput("", 2)).rejects.toThrow("Invalid input parameters.");
            await expect(summarizeWikipediaOutput("quantum physics", 0)).rejects.toThrow("Invalid input parameters.");
        });
    });
});