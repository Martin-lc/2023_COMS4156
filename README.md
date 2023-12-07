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

1. Ensure you have Node.js installed on your machine (https://nodejs.org/en/download). This project uses **v18.18.2.**
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

## Continuous Integration Test

* Github action is used to to implement continuous integration tests for the project. Each time there is a push or merge to the main, CI tests are run.
  * The workflow files are located at: `https://github.com/Martin-lc/2023_COMS4156/tree/main/.github/workflows`
* CI tests include a test for unit tests and integration tests as well as tests for `style checking` and `static analysis` using `ESLint`

## Branch Coverage

* We will jest for code coverage analysis -- simply type` npx jest --coverage` to check for branch coverage for the repository

## Run tasks via terminal (demo - 1st Iteration)

to run the demo, simply type `npm run demo` in the project root directory. To make it work properly:

1. change the `user_path` to your pwd at project root directory
2. demo.js take 3 parameters: `query`, `userPreference` (user preference), and `record_num` (record number)
   1. `query`: the query you want to input
   2. `userPreference`:u se comma to separate different input strings with no space in between
   3. `record_num`: limit to 2 or 3 for best demonstration effect and wait time
3. example run: `npm run demo --  --userPreference wellness,elder,covid,nutrition --record_num 2`, enter query when prompted: `what should I do if I have covid?`

## Running the Server and Testing via Postman (demo - 1st Iteration)

### Starting the Server:

1. Set your OpenAI API key: `export OPENAI_API_KEY=your_openai_api_key`
2. Start the server with: `node server.js`

### Testing with Postman:

1. Open Postman and create a new POST request to `http://localhost:3000/demo`
2. Set the body to `raw` and `JSON (application/json)`, and input:
   ```json
   {
     "query": "I want to learn about long COVID symptoms",
     "userPreference": "wellness,elder,covid,nutrition",
     "record_num": 2
   }

   ```
3. Hit Send. Make sure your server is running when testing with Postman.

## Running the Application (2nd Iteration)

### Starting the Server:

1. Set your OpenAI API key: `export OPENAI_API_KEY=your_openai_api_key`
2. Start the server with: `node server.js`

### Starting the Application with http-server

1. To start the application, navigate to the directory containing your client files and run `npm run server`
2. This will start a local web server on port 8080. You can access the application by going to http://localhost:8080 in your web browser.

## Running End-to-End (E2E) Tests

The application includes end-to-end tests written with Puppeteer and Jest. These tests simulate user interactions with the web application in a headless Chrome browser. To run only the end-to-end tests, use the following Jest command:

```
npx jest --testRegex '.e2e.test.js$' 
```

This command will execute tests in files that match the .e2e.test.js pattern. Make sure the application is running via http-server before executing the tests.
