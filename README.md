# 2023_COMS4156
advanced software engineering course project - FA2023

## Some Dependencies
### Set up Jest
**I quit using Jest because it's somehow incompatible with langchain huggingface integration.**
1. set up jest for your project: `npm install --save-dev jest`
2. install jest vscode extension: Orta.vscode-jest
3. set up your `package.json`, add 

    ```json
    "scripts": {
      "test": "jest"
    },
    "jest": {
        "testMatch": [
        "**/test/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
        ]
    }
      ```
    
4. write some unit test codes under `test` folder
5. `npm test` to run test code

### Set up Sqlite3
I think we can use sqlite3 for non-vector storage, like user ID, preference and prompt. Use `npm install sqlite3` to set up sqlite3 in js.

### Langchain JS
Install langchain: 

```bash
# openai
npm install -S langchain
npm install -S openai
npm install @huggingface/inference@1
```

## Test code
Test files are placed in the `test` folder. Run `bash test.sh` to run all test files.