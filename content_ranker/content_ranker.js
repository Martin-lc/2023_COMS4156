const OpenAI = require("langchain/llms/openai").OpenAI;
const PromptTemplate = require("langchain/prompts").PromptTemplate;
const OpenAIEmbeddings=require("langchain/embeddings/openai").OpenAIEmbeddings;
const math = require('mathjs');

/* Create instance for embeddings */
const embeddings = new OpenAIEmbeddings();

/* Create instance for using OpenAI's language model */
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetches embeddings for a given text.
 * @param {string} text - The text to get embeddings for.
 * @returns {Promise<Array>} A promise that resolves to an array of embeddings.
 */
async function getEmbeddings(text) {
    try {
        const response = await embeddings.embedQuery(text);
        return response;
    } catch (error) {
        console.error('Error fetching embeddings, using fallback:', error);
        // Fallback: return null
        return null;
    }
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param {Array} vecA - The first vector.
 * @param {Array} vecB - The second vector.
 * @returns {number} The cosine similarity between the two vectors.
 */
function cosineSimilarity(vecA, vecB) {
    return math.dot(vecA, vecB) / (math.norm(vecA) * math.norm(vecB));
}

/**
 * Calculates a combined score based on content, preferences vector, and generated words.
 * @param {string} content - The content to score.
 * @param {Array} preferencesVector - The preferences vector.
 * @param {Array} generatedWords - The generated words.
 * @returns {Promise<number>} A promise that resolves to the combined score.
 */
async function combinedScore(content, preferencesVector, generatedWords) {
    try {
        if (!preferencesVector) {
            return fallbackScore(generatedWords, content) * 100;
        }
        const contentVector = await getEmbeddings(content);
        const cosineScore = cosineSimilarity(preferencesVector, contentVector);
        const originalScore = scoreContent(generatedWords, content);
        return (cosineScore * 0.5 + originalScore * 0.5) * 100;
    } catch (error) {
        console.error('Error calculating combined score:', error);
        throw error;
    }
}

function fallbackScore(generatedWords, content) {
    let score = 0;
    generatedWords.forEach(word => {
        score += countWordOccurrences(word, content);
    });
    return score;
}
/**
 * Generates related words based on given preferences.
 * @param {string} preferences - The preferences words.
 * @returns {Promise<Object>} A promise that resolves to an object containing original and generated words.
 */
async function generateRelatedWords(preferences) {
    try {
        const prompt = PromptTemplate.fromTemplate("I want to ranking the content by the user preferences, so I will give you 3 preferences words from a user and you generate 10 related words for each preference word and i will count them in the content to do the count.Return the generated 30 words without the original words without any other text and comma-separated. Here are the preferences words:{preference}");
        const formattedPrompt = await prompt.format({preference: preferences});
        const llmResult = await llm.predict(formattedPrompt);
        const generatedWords = llmResult.split(',').map(word => word.trim());
        console.log("generatedWords", generatedWords);
        return {
            originalWords: preferences.split(',').map(word => word.trim()),
            generatedWords: generatedWords,
        };
    } catch (error) {
        console.error('Error generating related words, using fallback:', error);
        // Fallback: return original words as generated words
        return {
            originalWords: preferences.split(',').map(word => word.trim()),
            generatedWords: preferences.split(',').map(word => word.trim()),
        };
    }
}
/**
 * Counts the number of occurrences of a specific word in a given content.
 * @param {string} word - The word to count occurrences of.
 * @param {string} content - The content to search within.
 * @returns {number} The number of times the word occurs in the content.
 */
function countWordOccurrences(word, content) {
    const words = content.split(/[\s,]+/);
    let count = 0;
    words.forEach(w => {
        if (w === word) count++;
    });
    return count;
}
/**
 * Scores a piece of content based on the frequency of generated words.
 * The score is the sum of occurrences of each generated word divided by the total word count.
 * @param {Array} generatedWords - An array of words generated based on user preferences.
 * @param {string} content - The content to be scored.
 * @returns {number} The score of the content based on word frequency.
 */
function scoreContent(generatedWords, content) {
    let score = 0;
    generatedWords.forEach(word => {
        score += countWordOccurrences(word, content);
    });
    //const firstFiveWords = content.split(' ').slice(0, 3).join(' ');


    const wordCount = content.split(' ').length; // Count of words
    //console.log(firstThreeWords, ':', score / wordCount);
    return score / wordCount;
}

/**
 * Ranks a list of contents based on a combined score.
 * @param {Array} contents - An array of contents to be ranked.
 * @param {Array} preferencesVector - The vector representing user preferences.
 * @param {Array} generatedWords - Words generated related to user preferences.
 * @returns {Promise<Array>} A promise that resolves to an array of contents sorted by their combined score.
 */
async function rankContents(contents, preferencesVector, generatedWords) {
    const scoredContents = await Promise.all(contents.map(async content => {
        const combinedScoreValue = await combinedScore(content, preferencesVector, generatedWords);
        const firstFiveWords = content.split(' ').slice(0, 5).join(' ');
        console.log('Content:::',firstFiveWords, ':::', 'combinedScore:', combinedScoreValue)
        return {
            content: content,
            combinedScore: combinedScoreValue
        };
    }));

    return scoredContents.sort((a, b) => b.combinedScore - a.combinedScore);
}
/**
 * Retrieves the top content based on user preferences.
 * @param {string} preferences - User preferences as a comma-separated string.
 * @param {Array} contents - An array of contents to be evaluated.
 * @returns {Promise<string>} A promise that resolves to the content with the highest score.
 */
async function getTopContent(preferences, contents) {
    console.log("Generating related words based on client preferences...");
    const { generatedWords } = await generateRelatedWords(preferences);
    console.log("Vectorizing preferences...");
    const preferencesVector = await getEmbeddings(preferences);
    console.log("Done");
    console.log("Ranking the contents...");
    const ranked = await rankContents(contents, preferencesVector, generatedWords);
    console.log("Done");
    return ranked[0].content;  // Return the highest-scoring content
}

module.exports = {
    getEmbeddings,
    cosineSimilarity,
    combinedScore,
    generateRelatedWords,
    countWordOccurrences,
    scoreContent,
    rankContents,
    getTopContent
};
// async function runTests() {
//     console.log("Testing Embedding Query...");
//     const sampleText = "Hello, world!";
//     const embeddingsResult = await getEmbeddings(sampleText);
//     console.log("Embeddings Result:", embeddingsResult);

//     console.log("Testing Cosine Similarity...");
//     const vecA = [1, 2, 3];
//     const vecB = [4, 5, 6];
//     const similarity = cosineSimilarity(vecA, vecB);
//     console.log("Cosine Similarity:", similarity);

//     console.log("Testing Content Scoring and Ranking...");
//     const contents = ["This is a test content.", "Another test content here.", "Yet another piece of content."];
//     const preferences = "test, content";
//     const { generatedWords } = await generateRelatedWords(preferences);
//     const rankedContents = await rankContents(contents, await getEmbeddings(preferences), generatedWords);
//     console.log("Ranked Contents:", rankedContents);

//     console.log("Testing Top Content Retrieval...");
//     const topContent = await getTopContent(preferences, contents);
//     console.log("Top Content:", topContent);
// }

// runTests().then(() => console.log("Tests completed.")).catch(err => console.error("Tests failed:", err));