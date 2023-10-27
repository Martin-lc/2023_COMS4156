'use strict';

const user_path = '/Users/wuyu/Desktop/4156/2023_COMS4156'
const argv = require('yargs').argv;
const readlineSync = require('readline-sync');
const { OpenAI } = require("langchain/llms/openai");
const { extractKeywords_text } = require(user_path + '/client_info_mgt/client_info_mgt');
const { summarizePubmedOutput, summarizeWikipediaOutput } = require(user_path + '/content_optimizer/llm');
const { getTopContent } = require(user_path + '/content_ranker/content_ranker');

async function demo() {
    // mock input
    const query = readlineSync.question('Enter text input: ');
    const userPreference = argv.userPreference
    const record_num = argv.record_num

    //initialize chatGPT
    const llm = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // keyword extraction from query provided by client
    const keywords = await extractKeywords_text(query, userPreference.split(','), llm)
    console.log("keywords extracted: ", keywords)

    // retrieve raw contents based on generated keywords, then summarize using openai api
    const pubmedContent = await summarizePubmedOutput(keywords.replace(/,/g, '+'), record_num)
    console.log("summarized pubmed content: ", pubmedContent)
    const wikiContent = await summarizeWikipediaOutput(keywords.replace(/,/g, ' '), record_num)
    console.log("summarized wiki content: ", wikiContent)

    // use our top-notch ranking algorithm to rank contents
    const concatenatedContent = pubmedContent.map(item => item.content)
        .concat(wikiContent.map(item => item.content));
    const topContent = await getTopContent(userPreference, concatenatedContent)
    console.log("top content: ", topContent)
}

demo();

