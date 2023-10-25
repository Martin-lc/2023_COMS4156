const { extractKeywords, storeUserData, getUserData, handleUserQuery } = require('../client_info_mgt/client_info_mgt');
const { OpenAI } = require("langchain/llms/openai");

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY })

describe('Test client_info_mgt.js functions', () => {

  test('Test extractKeywords function', async () => {
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords_list = ['sports', 'economic', 'art', 'tech'];

    const keywords = await extractKeywords(
      queryContent,
      userPreference,
      keywords_list,
      model
    );

    console.log(keywords);
  }, 10000); // 10 seconds timeout

  test('Test storeUserData and getUserData functions', async () => {
    const userId = 'user123';
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords = 'tech'

    // Test storeUserData
    await storeUserData(userId, userPreference, queryContent, keywords);

    // Test getUserData
    const user_data = await getUserData(userId);

    expect(user_data.userId).toEqual(userId);
    expect(user_data.userPreference).toEqual(userPreference);
    expect(user_data.queryContent).toEqual(queryContent);
  });

  test('Test handleUserQuery function', async () => {
    const userId = 'user123';
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords_list = ['sports', 'economic', 'art', 'tech'];

    const keywords = await handleUserQuery(
      userId,
      queryContent,
      userPreference,
      keywords_list,
      model
    );

    console.log(keywords);
  });
});