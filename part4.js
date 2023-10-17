
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: "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",
});

import { PromptTemplate } from "langchain/prompts";

const prompt = PromptTemplate.fromTemplate("I want to ranking the content by the user preferences, \
so I will give you the preferences words from a user and you generate 10 related words for each \
preference and i will count them in the content to do the count.Only return the generated words \
without any other text. Here is the preferences:{preference}");

const formattedPrompt = await prompt.format({
  preference: "colorful socks",
});

const { db, getUserData } = require('./part1.js');

function getAllUserIds(callback) {
    const query = "SELECT userId FROM user_data";
    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err);
        }
        const userIds = rows.map(row => row.userId);
        callback(null, userIds);
    });
}

function countWordOccurrences(word, content) {
    const words = content.split(/[\s,]+/);
    let count = 0;
    words.forEach(w => {
        if (w === word) count++;
    });
    return count;
}

function main() {
    getAllUserIds((err, userIds) => {
        if (err) {
            console.error("Error fetching user IDs:", err);
            return;
        }

        console.log("All User IDs:", userIds);

        const uniquePreferences = new Set();
        const userContents = {};

        userIds.forEach(userId => {
            getUserData(userId, (err, user) => {
                if (err) {
                    console.error(`Error fetching data for user ${userId}:`, err);
                    return;
                }

                user.userPreference.split(/[\s,]+/).forEach(word => uniquePreferences.add(word));
                userContents[userId] = user.queryContent;
            });
        });

        let maxCount = 0;
        let maxContent = "";

        userIds.forEach(userId => {
            let currentCount = 0;
            uniquePreferences.forEach(pref => {
                currentCount += countWordOccurrences(pref, userContents[userId]);
            });

            if (currentCount > maxCount) {
                maxCount = currentCount;
                maxContent = userContents[userId];
            }
        });

        console.log("Content with the most word occurrence:", maxContent);
    });
}

main();

// Remember to close the database connection once done
db.close();
