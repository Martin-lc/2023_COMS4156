const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require("langchain/llms/openai");
const { extractKeywords_text } = require('./client_info_mgt/client_info_mgt');
const { summarizePubmedOutput, summarizeWikipediaOutput } = require('./content_optimizer/llm');
const { getTopContent } = require('./content_ranker/content_ranker');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.post('/demo', async (req, res) => {
    try {
        // Destructuring data from the request body
        const { query, userPreference, record_num } = req.body;

        // If the query is empty, return an error
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Input text cannot be empty.' });
        }

        // Initialize chatGPT
        const llm = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // Extract keywords from the query provided by the client
        const keywords = await extractKeywords_text(query, userPreference.split(','), llm);
        
        // Retrieve raw contents based on the generated keywords, and then summarize using the OpenAI API
        const pubmedContent = await summarizePubmedOutput(keywords.replace(/,/g, '+'), record_num);
        const wikiContent = await summarizeWikipediaOutput(keywords.replace(/,/g, ' '), record_num);

        // Use our top-notch ranking algorithm to rank contents
        const concatenatedContent = pubmedContent.map(item => item.content)
            .concat(wikiContent.map(item => item.content));
        const topContent = await getTopContent(userPreference, concatenatedContent);

        // Send the results as a JSON response
        res.json({
            keywords: keywords,
            pubmedContent: pubmedContent,
            wikiContent: wikiContent,
            topContent: topContent
        });
    } catch (error) {
        // If there's an error, send a 500 status code with the error message
        res.status(500).json({ error: error.message });
    }
});

// Start the server on the specified PORT
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
