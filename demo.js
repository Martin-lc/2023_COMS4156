'use strict';

const user_path = process.env.PROJ_4156_PATH;
const argv = require('yargs').argv;
const readlineSync = require('readline-sync');
const {OpenAI} = require('langchain/llms/openai');
const {extractKeywords_text} = require(user_path + '/client_info_mgt/client_info_mgt');
const {summarizePubmedOutput, summarizeWikipediaOutput} = require(user_path + '/content_optimizer/llm');
const {getContentByKeywords} = require(user_path + '/content_fetcher/pubmed');
const {fetchWikipediaData} = require(user_path + '/content_fetcher/wikipedia');
const {getTopContent} = require(user_path + '/content_ranker/content_ranker');

async function demo() {
  // mock input
  const query = readlineSync.question('Enter text input: ');
  const userPreference = argv.userPreference;
  const record_num = argv.record_num;

  // initialize chatGPT
  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // keyword extraction from query provided by client
  const keywords = await extractKeywords_text(query, userPreference.split(','), llm);
  console.log('keywords extracted: ', keywords);

  // retrieve raw contents based on generated keywords
  const rawPubmedContent = await getContentByKeywords(keywords.replace(/,/g, '+'), record_num);
  console.log('raw pubmed content: ', rawPubmedContent);
  const rawWikiContent = await fetchWikipediaData(keywords.replace(/,/g, ' '), record_num);
  console.log('raw wiki content: ', rawWikiContent);

  // summarize raw content using openai api
  const pubmedContent = await summarizePubmedOutput(rawPubmedContent, record_num);
  console.log('summarized pubmed content: ', pubmedContent);
  const wikiContent = await summarizeWikipediaOutput(rawWikiContent, record_num);
  console.log('summarized wiki content: ', wikiContent);

  // use our top-notch ranking algorithm to rank contents
  const concatenatedContent = pubmedContent.map((item) => item.content)
      .concat(wikiContent.map((item) => item.content));
  const topContent = await getTopContent(userPreference, concatenatedContent);
  console.log('top content: ', topContent);
}

demo();

