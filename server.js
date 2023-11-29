const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require("langchain/llms/openai");
const { extractKeywords_text } = require('./client_info_mgt/client_info_mgt');
const { summarizePubmedOutput, summarizeWikipediaOutput } = require('./content_optimizer/llm');
const { getContentByKeywords } = require('./content_fetcher/pubmed');
const { fetchWikipediaData } = require('./content_fetcher/wikipedia');
const { getTopContent } = require('./content_ranker/content_ranker');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/demo', async (req, res) => {
    try {
        const { query, userPreference, record_num } = req.body;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Input text cannot be empty.' });
        }

        const llm = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const keywords = await extractKeywords_text(query, userPreference.split(','), llm);

        const rawPubmedContent = await getContentByKeywords(keywords.replace(/,/g, '+'), record_num);
        const rawWikiContent = await fetchWikipediaData(keywords.replace(/,/g, ' '), record_num);

        const pubmedContent = await summarizePubmedOutput(rawPubmedContent, record_num);
        const wikiContent = await summarizeWikipediaOutput(rawWikiContent, record_num);

        const concatenatedContent = pubmedContent.map(item => item.content)
            .concat(wikiContent.map(item => item.content));
        const topContent = await getTopContent(userPreference, concatenatedContent);

        res.json({
            keywords: keywords,
            pubmedContent: pubmedContent,
            wikiContent: wikiContent,
            topContent: topContent
        });
    } catch (error) {
        console.error('Error handling /demo request:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
