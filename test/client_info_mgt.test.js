// const {cli} = require('webpack');
const { extractKeywords, extractKeywords_text, storeUserData, getUserData, handleUserQuery } = require('../client_info_mgt/client_info_mgt');
const { OpenAI } = require('langchain/llms/openai');

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

describe('Test client_info_mgt.js functions', () => {
  test('Test extractKeywords function', async () => {
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords_list = ['sports', 'economic', 'art', 'tech'];

    const keywords = await extractKeywords(
      queryContent,
      userPreference,
      keywords_list,
      model,
    );

    console.log(keywords);
  }, 10000); // 10 seconds timeout

  test('Test extractKeywords_text function', async () => {
    const userPreference = ['sports', 'economic', 'art', 'tech'];
    const queryContent = 'latest in tech';

    const keywords = await extractKeywords_text(
      queryContent,
      userPreference,
      model,
    );

    console.log(keywords);
  }, 10000); // 10 seconds timeout

  test('Test storeUserData function with clientId and test getUserData', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const userPreference = 'sports';
    const queryContent = 'football games';
    const keywords = 'sports, football';

    // Test storeUserData
    await storeUserData(clientId, userId, userPreference, queryContent, keywords);

    // Test getUserData
    const user_data = await getUserData(clientId);

    expect(user_data.clientId).toEqual(clientId);
    expect(user_data.userId).toEqual(userId);
    expect(user_data.userPreference).toEqual(userPreference);
    expect(user_data.queryContent).toEqual(queryContent);
  });

  test('Test handleUserQuery function, firsttime access', async () => {
    const clientId = 'clientx';
    const userId = 'userx';
    const queryContent = 'latest smartphones';
    const newPreference = 'tech';
    const keywords_list = ['smartphone', 'tech', 'innovation'];

    const keywords = await handleUserQuery(
      clientId,
      userId,
      queryContent,
      newPreference,
      keywords_list,
      model,
    );

    expect(keywords).toContain('smartphone');
    console.log(keywords);
  });

  test('Test handleUserQuery function with clientID', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const queryContent = 'latest smartphones';
    const newPreference = 'tech';
    const keywords_list = ['smartphone', 'tech', 'innovation'];

    const keywords = await handleUserQuery(
      clientId,
      userId,
      queryContent,
      newPreference,
      keywords_list,
      model,
    );

    expect(keywords).toContain('smartphone');
    console.log(keywords);
  });

  test('Test handleUserQuery function with the same user and user prerference', async () => {
    const clientId = 'client1';
    const userId = 'user1';
    const queryContent = 'innovation';
    const newPreference = 'tech';
    const keywords_list = ['smartphone', 'tech', 'innovation'];

    const keywords = await handleUserQuery(
      clientId,
      userId,
      queryContent,
      newPreference,
      keywords_list,
      model,
    );

    expect(keywords).toContain('innovation');
    console.log(keywords);
  });

  // Test handling multiple client instances
  test('Handle multiple client instances', async () => {
    const clientId1 = 'client1';
    const clientId2 = 'client2';
    const userId = 'user1';

    const queryResult1 = await handleUserQuery(clientId1, userId, 'query1', 'preference1', ['keyword1', 'keyword2'], model);
    const queryResult2 = await handleUserQuery(clientId2, userId, 'query2', 'preference2', ['keyword3', 'keyword4'], model);

    expect(queryResult1).not.toBe(queryResult2); // Assuming different results for different queries
  });

  // Test for data isolation between client instances
  test('Data isolation between client instances', async () => {
    const clientId1 = 'client1';
    const clientId2 = 'client2';

    const userData1 = await getUserData(clientId1);
    const userData2 = await getUserData(clientId2);

    expect(userData1).not.toEqual(userData2); // Ensure data is isolated between clients
  });

  // Test for concurrent access by different clients with different user IDs
  test('Concurrent access by different clients with different user IDs', async () => {
    const clientId1 = 'client1';
    const userId1 = 'user1';
    const clientId2 = 'client2';
    const userId2 = 'user2';

    // Client 1 is interested in technology
    const queryContent1 = 'latest smartphones';
    const newPreference1 = 'technology';
    const keywords_list1 = ['smartphones', 'gadgets', 'innovation'];

    // Client 2 is interested in travel
    const queryContent2 = 'best European destinations';
    const newPreference2 = 'travel';
    const keywords_list2 = ['europe', 'tourism', 'destinations'];

    // Simulate concurrent requests
    const [result1, result2] = await Promise.all([
      handleUserQuery(clientId1, userId1, queryContent1, newPreference1, keywords_list1, model),
      handleUserQuery(clientId2, userId2, queryContent2, newPreference2, keywords_list2, model),
    ]);

    // Assert that the results are specific to each client and user
    expect(result1).toContain('smartphones'); // Assuming technology-related keywords are returned for user1
    expect(result2).toContain('europe'); // Assuming travel-related keywords are returned for user2
    expect(result1).not.toEqual(result2); // Ensure results are different for different users
  });
});
