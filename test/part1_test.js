import {
    extractKeywords,
    extractKeywords_text,
    updatePreference,
    storeUserData,
    getUserData,
    handleText,
    handleUserQuery,
    db
  } from '../part1.js';
import { HuggingFaceInference } from "langchain/llms/hf";
import { OpenAI } from "langchain/llms/openai";

// const model = new OpenAI({});
const model = new HuggingFaceInference({
  model: "gpt2",
  apiKey: "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"
});

const keywords_list = ['sports', 'economic', 'art', 'science', 'tech'];

// Test extractKeywords
let userId1 = 'user123';
let userPreference1 = 'tech news';
let queryContent1 = 'latest in tech';
let keywords;
keywords = await extractKeywords(queryContent1, userPreference1, keywords_list, model);
console.log(keywords);

// test storeUserData
await storeUserData(userId1, userPreference1, queryContent1, keywords);

// test getUserData
let user_data1 = await getUserData(userId1);
console.log(user_data1);


db.run(`DELETE FROM user_data WHERE userId = ?`, userId1, function(err) {
    if (err) {
        return callback(err);
    }
    console.log(`Deleted ${this.changes} row(s)`);
    // callback(null, this.changes);
});

keywords = await handleUserQuery(userId1, queryContent1, userPreference1, keywords_list, model)
console.log(keywords);

// Test the same user, second entry
let queryContent2 = 'some economic news';
keywords = await handleUserQuery(userId1, queryContent2, userPreference1, keywords_list, model)
console.log(keywords);

let userId2 = 'user124';
let queryContent3 = 'economic news';
let userPreference2 = 'news, sports';



db.close(err => {
    if (err) {
        return console.error(err.message);
    }
});

