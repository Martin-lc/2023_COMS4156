
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: "...",
});

import { PromptTemplate } from "langchain/prompts";


async function generateRelatedWords(preferences) {
    const prompt = PromptTemplate.fromTemplate("I want to ranking the content by the user preferences, \
  so I will give you the preferences words from a user and you generate 10 related words for each \
  preference and i will count them in the content to do the count.Only return the generated words \
  without any other text and comma-separated. Here is the preferences:{preference}");
  
    const formattedPrompt = await prompt.format({
      preference: preferences,
    });
  
    const llmResult = await llm.predict(formattedPrompt);
  
    // Extract the generated words from the llmResult. 
    // This step assumes a certain structure of the llmResult which might need adjustment.
    // Split the string into an array of words
    const generatedWords = llmResult.split(',').map(word => word.trim());

    return {
      originalWords: preferences.split(',').map(word => word.trim()),
      generatedWords: generatedWords,
    };
  }

function countWordOccurrences(word, content) {
    const words = content.split(/[\s,]+/);
    let count = 0;
    words.forEach(w => {
        if (w === word) count++;
    });
    return count;
}
// Function to score a content based on word occurrences
function scoreContent(generatedWords, content) {
    let score = 0;
    generatedWords.forEach(word => {
        score += countWordOccurrences(word, content);
    });
    return score;
}

// Function to rank contents based on their scores
function rankContents(contents, generatedWords) {
    const scoredContents = contents.map(content => ({
        content: content,
        score: scoreContent(generatedWords, content)
    }));

    // Sort contents by score in descending order
    return scoredContents.sort((a, b) => b.score - a.score);
}

// Main function to get the highest-scoring content
async function getTopContent(userId, preferences, contents) {
    const { generatedWords } = await generateRelatedWords(preferences);
    const ranked = rankContents(contents, generatedWords);
    return ranked[0].content;  // Return the highest-scoring content
}



// Example usage:
// generateRelatedWords("love, happiness, joy").then(result => {
//     console.log("Original Words:", result.originalWords);
//     console.log("Generated Words:", result.generatedWords);
// });

async function main() {
    // Assumed inputs:
    const userId = "sampleUserID";
    const preferences = "love, happiness, joy";

    // Assuming the LLM generates the following  contents
    const contents = [
        "Love is in the air, happiness surrounds us.",
        "Joy is a profound feeling of happiness and love.",
        "Find joy in the small things in life.",
        // ... add more dummy content strings for testing
    ];

    const topContent = await getTopContent(userId, preferences, contents);
    console.log("Top Content:", topContent);
}

main();


