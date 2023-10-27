const {
    summarizeText,
    atomChat,
    summarizePubmedOutput,
    summarizeWikipediaOutput
} = require('../content_optimizer/llm');

// Mocking the external modules to avoid actual API calls during testing
jest.mock('../content_fetcher/pubmed');
jest.mock('../content_fetcher/wikipedia');

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

    //iteration 2
    // // Test for summarizePubmedOutput
    // describe("summarizePubmedOutput", () => {
    //     it("should throw an error for invalid input (not an array)", async () => {
    //         await expect(summarizePubmedOutput("invalid input")).rejects.toThrow("Invalid input. Expected an array of PubMed data.");
    //     });

    //     it("should throw an error for invalid input format (missing properties)", async () => {
    //         const invalidMockData = [{
    //             content: "Missing id property."
    //         }];
    //         await expect(summarizePubmedOutput(invalidMockData)).rejects.toThrow("Invalid input format. Expected PubMed data with 'id' and 'content' properties.");
    //     });
    // });

    // // Test for summarizeWikipediaOutput
    // describe("summarizeWikipediaOutput", () => {
    //     it("should throw an error for invalid input (not an array)", async () => {
    //         await expect(summarizeWikipediaOutput("invalid input")).rejects.toThrow("Invalid input. Expected an array of Wikipedia data.");
    //     });

    //     it("should throw an error for invalid input format (missing properties)", async () => {
    //         const invalidMockData = [{
    //             title: "Missing content property."
    //         }];
    //         await expect(summarizeWikipediaOutput(invalidMockData)).rejects.toThrow("Invalid input format. Expected Wikipedia data with 'title' and 'content' properties.");
    //     });
    // });
});