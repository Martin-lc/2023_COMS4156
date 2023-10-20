# 2023_COMS4156

advanced software engineering course project - FA2023

## Overall Description

We aim to build a ChatGPT based content recommendation API service to suggest interesting, educational, and curated contents to clients. Our service would intake textual requests (e.g. I want to learn more about long COVID symptoms ) given by clients (e.g. content seeking APPs or services) and output recommended contents in a summarized fashion back to the clients. We envision five key functionalities and logistics inside our API service:

### client information management

This module interacts with clients and databases to manage client’s content preferences. It receives initial preferences given by the client and stores it in the database with the client ID. It also retrieves client preferences from the database upon request by other APIs. It also updates client preferences based on the prompts the client provided overtime. Overall, it serves as the core management system of preferences for each client.

### content fetching integration

This module mainly integrates different source content APIs, such as OpenAI API, WikiMedia API, and PubMed API, etc. to retrieve a plethora of contents based on information about the client, such as the keywords extracted from client’s prompt. Overall this API serves as an integrated platform to retrieve raw contents from different sources.

### Content Optimization

This module converts the raw contents into semi-bespoke and summarized contents based on user preferences. Different raw contents retrieved from source content directly can have vastly different characteristics to work with. Therefore, this module makes sure that these contents are sanitized and prepared so that they can be compared during the ranking process. Overall, it serves as an intermediate API between Content Integration and Content Ranking that summarizes, standarizes, and optimizes the content before they are to be ranked.

### Content Ranking

This module intakes different contents and client information to rank the contents and return the most tailored content to the client/API.

## Setup

### Node.js

1. Ensure you have Node.js installed on your machine.
2. Navigate to the project directory and install the required dependencies:

```bash
npm install
```

### Jest

1. set up jest for your project: `npm install --save-dev jest`
2. install jest vscode extension: Orta.vscode-jest
3. set up your `package.json`, add

   ```json
   "scripts": {
     "test": "jest"
   },
   "jest": {
       "testMatch": [
           "**/unit_test/**/*.test.js"
       ]
   }
   ```
4. write some unit test codes under `test` folder
5. `npm test` to run test code

### Sqlite3

We usesqlite3 for non-vector storage, like user ID, preference and prompt. Use `npm install sqlite3` to set up sqlite3 in j

### Langchain JS

Install langchain:

```bash
# openai
npm install -S langchain
npm install -S openai
```
