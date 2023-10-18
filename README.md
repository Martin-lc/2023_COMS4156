# COMS 4156 Fall 2023
# Part 3: LLM-Based API-Retrieved Content Summarization 

`llm.js` is a module designed to interface with the OpenAI model and fetch, process, and summarize content from both PubMed and Wikipedia based on given keywords.

## Functions

### `atomChat(text)`

#### Description:
Sends a text prompt to the OpenAI model and returns the response.

#### Parameters:
- `text` (String): The text to be sent as a prompt to the OpenAI model.

#### Returns:
A Promise resolving to a string, which is the model's response.

#### Example:
```javascript
atomChat("Tell me a joke").then(response => console.log(response));
```
---

### `summarizeText(text)`
#### Description:
Summarizes the provided text using the OpenAI model.

#### Parameters:
- `text` (String): The text to be summarized.
  
#### Returns:
A Promise resolving to a string, which is the summarized version of the input text.

#### Example:
```javascript
summarizeText("Long text to be summarized...").then(summary => console.log(summary));
```
---

### `summarizePubmedOutput(queryWords, numRecords)`
#### Description:
Retrieves articles from PubMed based on the given query words and summarizes their content using the OpenAI model.

#### Parameters:
- `queryWords` (String): The keywords to search for in PubMed.
- `numRecords` (Number): The number of records to retrieve from PubMed.
  
#### Returns:
A Promise resolving to an array of objects. Each object contains the ID, source (always 'pubmed'), and summarized content of each article.

#### Example:
```javascript
summarizePubmedOutput("dementia+elder", 2).then(summarizedResults => console.log(summarizedResults));
```
---

### `summarizeWikipediaOutput(keywords, numRecords)`
#### Description:
Retrieves articles from Wikipedia based on the given keywords and then summarizes their content using the OpenAI model.

#### Parameters:
- `keywords` (String): The keywords to search for in Wikipedia.
- `numRecords` (Number): The number of records to retrieve from Wikipedia.
  
#### Returns:
A Promise resolving to an array of objects. Each object contains the title, source (always 'wikipedia'), and summarized content of each article.

#### Example:
```javascript
summarizeWikipediaOutput("quantum physics", 2).then(summarizedResults => console.log(summarizedResults));
```
---

## Dependencies

- `langchain/llms/openai`: For interfacing with OpenAI.
- `langchain/prompts`: To create chat prompts for OpenAI.
- `xmldom`: For parsing XML data.
- `pubmed.js`: Custom module to fetch content from PubMed.
- `wikipedia.js`: Custom module to fetch content from Wikipedia.

Ensure that all the dependencies are installed in your project.
