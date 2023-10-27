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

1. Ensure you have Node.js installed on your machine (https://nodejs.org/en/download).
2. Navigate to the project directory and install the required dependencies for this project by using `npm install` or `sudo npm install` with root privileges

### Important Dependencies

#### Jest

Jest is a popular JavaScript testing framework developed by Facebook. It is widely used and we use Jest for testing in this project

#### Sqlite3

We usesqlite3 for non-vector storage, like user ID, preference and prompt.

#### OpenAI

OpenAI API is a powerful artificial intelligence service provided by OpenAI that allows developers to integrate natural language processing capabilities into their applications. We use OpenAI API for various kinds of sub-tasks in this project.

#### Langchain JS

LangChain is a framework designed to simplify the creation of applications using large language models. We use Langchain for text generation in this project.

## Test

* type `npm test` in the project root directory to run test code.

## Run (demo)

to run the demo, simply type `npm run demo` in the project root directory. To make it work properly:

1. change the `user_path` to your pwd at project root directory
2. demo.js take 3 parameters: `query`, `userPreference` (user preference), and `record_num` (record number)
   1. `query`: the query you want to input
   2. `userPreference`:u se comma to separate different input strings with no space in between
   3. `record_num`: limit to 2 or 3 for best demonstration effect and wait time
3. example run: `npm run demo --  --userPreference wellness,elder,covid,nutrition --record_num 2`, enter query when prompted: `what should I do if I have covid?`

## Running the Server and Testing via Postman

### Starting the Server:

1. Set your OpenAI API key: `export OPENAI_API_KEY=your_openai_api_key`.
2. Start the server with: `node server.js`.

### Testing with Postman:

1. Open Postman and create a new POST request to `http://localhost:3000/demo`.
2. Set the body to `raw` and `JSON (application/json)`, and input:
   ```json
   {
     "query": "I want to learn about long COVID symptoms",
     "userPreference": "wellness,elder,covid,nutrition",
     "record_num": 2
   }

3. Hit Send. Make sure your server is running when testing with Postman.