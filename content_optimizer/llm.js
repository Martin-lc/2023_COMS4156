const { OpenAI } = require("langchain/llms/openai");
const { ChatPromptTemplate } = require("langchain/prompts");
const { DOMParser } = require('xmldom');
global.DOMParser = DOMParser;

// Initialize the OpenAI model
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends a text prompt to the OpenAI model and returns the response.
 * @param {string} text - The text to be sent as a prompt to the OpenAI model.
 * @returns {Promise<string>} The model's response.
 */
async function atomChat(text) {
    if (!text) {
        throw new Error("Input text cannot be empty.");
    }
    const res = await llm.call(text);
    return res;
}

/**
 * Summarizes and translates the provided text using the OpenAI model.
 * @param {string} text - The text to be summarized.
 * @param {number|null} [maxLength=null] - Optional. The maximum length for the summarized output. If not provided or null, there's no length constraint.
 * @param {string|null} [targetLanguage=null] - Optional. The ISO language code to translate the content into. If not provided or null, the content remains in the original language.
 * @returns {Promise<string>} The summarized and possibly translated version of the input text.
 */
async function summarizeText(text, maxLength = null, targetLanguage = null) {
    if (!text) {
        throw new Error("Input text cannot be empty.");
    }

    const lengthConstraint = maxLength ? ` Please ensure the summary does not exceed ${maxLength} characters.` : "";
    const translationInstruction = targetLanguage ? ` Then, translate the summary to ${targetLanguage}.` : "";

    const humanTemplate = "{input}";
    const template = `
        You are an expert in summarizing scientific content and translating text.
        Below you find an abstract from a scientific article:
        --------
        {input}
        --------
        Provide a concise summary of the abstract.${lengthConstraint}${translationInstruction}`;
    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", template],
        ["human", humanTemplate],
    ]);
    const chain = chatPrompt.pipe(llm);
    const res = await chain.invoke({
        input: text
    });
    return res;
}

/**
 * Summarizes articles from PubMed.
 * @param {Array<Object>} pubmedData - The array of articles fetched from PubMed.
 * @returns {Promise<Array<Object>>} An array of objects where each object contains 
 * the ID, source (always 'pubmed'), and summarized content of each article.
 */
async function summarizePubmedOutput(pubmedData, maxLength = null, targetLanguage = null) {
    if (!Array.isArray(pubmedData)) {
        throw new Error("Invalid input. Expected an array of PubMed data.");
    }

    let summarizedResults = [];
    console.log("summarizing pubmed data...");

    for (let entry of pubmedData) {
        let summary = await summarizeText(entry.content, , maxLength, targetLanguage);
        summary_trimmed = summary.replace(/\n+/g, ' ').trim();

        summarizedResults.push({
            id: entry.id,
            source: "pubmed",
            content: summary_trimmed
        });
    }
    console.log("Done");
    return summarizedResults;
}

/**
 * Summarizes articles from Wikipedia.
 * @param {Array<Object>} wikipediaData - The array of articles fetched from Wikipedia.
 * @returns {Promise<Array<Object>>} An array of objects where each object contains 
 * the title, source (always 'wikipedia'), and summarized content of each article.
 */
async function summarizeWikipediaOutput(wikipediaData, maxLength = null, targetLanguage = null) {
    if (!Array.isArray(wikipediaData)) {
        throw new Error("Invalid input. Expected an array of Wikipedia data.");
    }

    let summarizedResults = [];
    console.log("summarizing wiki data...");

    for (let entry of wikipediaData) {
        let summary = await summarizeText(entry.content, maxLength, targetLanguage);
        summary_trimmed = summary.replace(/\n+/g, ' ').trim();

        summarizedResults.push({
            title: entry.title,
            source: "wikipedia",
            content: summary_trimmed
        });
    }
    console.log("Done");
    return summarizedResults;
}

module.exports = {
    summarizeText,
    atomChat,
    summarizePubmedOutput,
    summarizeWikipediaOutput
};
