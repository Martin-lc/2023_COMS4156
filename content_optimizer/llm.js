const { OpenAI } = require("langchain/llms/openai");
const { ChatPromptTemplate } = require("langchain/prompts");
const { DOMParser } = require('xmldom');
global.DOMParser = DOMParser;

const pubmed = require('../content_fetcher/pubmed');
const wikipedia = require('../content_fetcher/wikipedia');


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
 * Summarizes the provided text using the OpenAI model.
 * @param {string} text - The text to be summarized.
 * @param {number|null} [maxLength=null] - Optional. The maximum length for the summarized output. If not provided or null, there's no length constraint.
 * @returns {Promise<string>} The summarized version of the input text.
 */
async function summarizeText(text, maxLength = null) {
    if (!text) {
        throw new Error("Input text cannot be empty.");
    }

    const lengthConstraint = maxLength ? ` Please ensure the summary does not exceed ${maxLength} characters.` : "";

    const humanTemplate = "{input}";
    const template = `
        You are an expert in summarizing scientific content.
        Below you find an abstract from a scientific article:
        --------
        {input}
        --------
        Provide a concise summary of the abstract.${lengthConstraint}`;
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
 * Retrieves articles from PubMed based on the given query words, 
 * then summarizes their content using the OpenAI model.
 * @param {string} queryWords - The keywords to search for in PubMed.
 * @param {number} numRecords - The number of records to retrieve from PubMed.
 * @returns {Promise<Array<Object>>} An array of objects where each object contains 
 * the ID, source (always 'pubmed'), and summarized content of each article.
 */
async function summarizePubmedOutput(queryWords, numRecords) {
    if (!queryWords || numRecords <= 0) {
        throw new Error("Invalid input parameters.");
    }

    const pubmedData = await pubmed.getContentByKeywords(queryWords, numRecords);
    const IdList = await pubmed.getIDByKeywords(queryWords, numRecords);

    let summarizedResults = [];
    console.log("summarizing pubmed data...")

    for (let i = 0; i < pubmedData.length; i++) {
        let concatenatedText = pubmedData[i].join(" ");
        let summary = await summarizeText(concatenatedText);
        summary_trimmed = summary.replace(/\n+/g, ' ').trim();

        summarizedResults.push({
            id: IdList[i],
            source: "pubmed",
            content: summary_trimmed
        });
    }
    console.log("Done")
    return summarizedResults;
}

/**
 * Retrieves articles from Wikipedia based on the given keywords, 
 * then summarizes their content using the OpenAI model.
 * @param {string} queryWords - The keywords to search for in Wikipedia.
 * @param {number} numRecords - The number of records to retrieve from Wikipedia.
 * @returns {Promise<Array<Object>>} An array of objects where each object contains 
 * the title, source (always 'wikipedia'), and summarized content of each article.
 */
async function summarizeWikipediaOutput(queryWords, numRecords) {
    if (!queryWords || numRecords <= 0) {
        throw new Error("Invalid input parameters.");
    }
    const wikipediaData = await wikipedia.fetchWikipediaData(queryWords, numRecords);

    let summarizedResults = [];
    console.log("summarizing wiki data...")

    for (let entry of wikipediaData) {
        let summary = await summarizeText(entry.content);
        summary_trimmed = summary.replace(/\n+/g, ' ').trim();

        summarizedResults.push({
            title: entry.title,
            source: "wikipedia",
            content: summary_trimmed
        });
    }
    console.log("Done")
    return summarizedResults;
}

module.exports = {
    summarizeText,
    atomChat,
    summarizePubmedOutput,
    summarizeWikipediaOutput
};