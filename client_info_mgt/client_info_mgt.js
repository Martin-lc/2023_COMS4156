const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./user_data.db');

// Introduce a new client ID to differentiate between multiple instances of a client
db.serialize(() => {
  db.run(
      'CREATE TABLE IF NOT EXISTS user_data (clientId TEXT UNIQUE, userId TEXT, userPreference TEXT, queryContent TEXT, keywords TEXT)',
  );
});

/**
 * Extract keywords based on user preferences and query content.
 *
 * @param {string} queryContent - The user's query content.
 * @param {string} userPreference - The user's preference.
 * @param {string[]} keywords_list - List of keywords.
 * @param {object} model - The language model to use for extraction.
 * @return {Promise<string>} - A Promise that resolves to the extracted keywords.
 */
const extractKeywords = async function(queryContent, userPreference, keywords_list, model) {
  // Prompt: Given text, select a few keywords from [kw1, kw2, kw3, kw4, ...]
  const keywordsString = '[' + keywords_list.join(', ') + ']';

  const formattedPrompt = `
    Given user preference: ${userPreference}, 
    and user query: ${queryContent},
    select one or a few keywords related to the user preference and user query from ${keywordsString}.
    return with comma as separator.
    return all in lowercase`;

  console.log(formattedPrompt);

  const res = await model.call(formattedPrompt);
  const res_new = res.replace(/\n/g, '');
  return res_new;
};

/**
 * Extract keywords from a given text.
 *
 * @param {string} text - The input text.
 * @param {string[]} keywords_list - List of keywords.
 * @param {object} model - The language model to use for extraction.
 * @return {Promise<string>} - A Promise that resolves to the extracted keywords.
 */
// const extractKeywords_text = async function (text, keywords_list, model) {
//   console.log("extracting keywords...");
//   const keywordsString = "[" + keywords_list.join(", ") + "]";

//   const formattedPrompt = `
//     Given the text: ${text},
//     select one or a few keywords from ${keywordsString},
//     return with comma as separator.`;

//   // console.log(formattedPrompt);

//   const res = await model.call(formattedPrompt);
//   console.log("Done")
//   return res;
// }

/**
 * Store user data in the database.
 *
 * @param {string} clientId - The client's unique identifier.
 * @param {string} userId - The user's unique identifier.
 * @param {string} userPreference - The user's preference.
 * @param {string} queryContent - The user's query content.
 * @param {string} keywords - The extracted keywords.
 * @return {Promise<void>} - A Promise that resolves when data is stored successfully.
 */
const storeUserData = async function (clientId, userId, userPreference, queryContent, keywords) {
  return new Promise((resolve) => {
    db.run("INSERT OR REPLACE INTO user_data (clientId, userId, userPreference, queryContent, keywords) VALUES (?, ?, ?, ?, ?)",
      [clientId, userId, userPreference, queryContent, keywords],
      function () {
        resolve();
      }
    );
  });
};

/**
 * Get user data from the database.
 *
 * @param {string} clientId - The user's unique identifier.
 * @return {Promise<object>} - A Promise that resolves to the user data retrieved from the database.
 */
const getUserData = async function (clientId) {
  return new Promise((resolve) => {
    db.get("SELECT * FROM user_data WHERE clientId = ?", [clientId], (err, row) => {
      resolve(row);
    });
  });
};


/**
 * Handle a user query, extracting keywords and updating user data.
 *
 * @param {string} userId - The user's unique identifier.
 * @param {string} queryContent - The user's query content.
 * @param {string} newPreference - The user's new preference.
 * @param {string[]} keywords_list - List of keywords.
 * @param {object} model - The language model to use for extraction.
 * @return {Promise<string>} - A Promise that resolves to the extracted keywords.
 */
const handleUserQuery = async function(clientId, userId, queryContent, newPreference, keywords_list, model) {
  const clientData = await getUserData(clientId);

  let userPreference;
  let keywords;

  if (clientData) {
    if (userPreference != clientData.userPreference) {
      userPreference = newPreference;
    } else {
      userPreference = clientData.userPreference;
    }

    keywords = await extractKeywords(queryContent, userPreference, keywords_list, model);
  } else {
    userPreference = newPreference;
    keywords = await extractKeywords(queryContent, userPreference, keywords_list, model);
  }

  await storeUserData(clientId, userId, userPreference, queryContent, keywords);

  return keywords;
};


module.exports = {
  extractKeywords,
  // extractKeywords_text,
  storeUserData,
  getUserData,
  handleUserQuery,
  db,
};
