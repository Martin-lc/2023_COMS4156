const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./user_data.db', (err) => {
  if (err) {
      console.error(err.message);
  }
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS user_data (userId TEXT UNIQUE, userPreference TEXT, queryContent TEXT, keywords TEXT)");
});

const extractKeywords = async function (queryContent, userPreference, keywords_list, model) {
    // Prompt: Given text, select a few keywords from [kw1, kw2, kw3, kw4, ...]
    const keywordsString = "[" + keywords_list.join(", ") + "]";

    const formattedPrompt = `
    Given user preference: ${userPreference}, 
    and user query: ${queryContent},
    select one or a few keywords related to the user preference and user query from ${keywordsString}.`;

    console.log(formattedPrompt);

    const res = await model.call(formattedPrompt);
    const res_new = res.replace(/\n/g, "");
    return res_new;
}

const extractKeywords_text = async function (text, keywords_list, model) {
    const keywordsString = "[" + keywords_list.join(", ") + "]";

    const formattedPrompt = `
    Given the text: ${text},
    select one or a few keywords from ${keywordsString}.`;

    console.log(formattedPrompt);
      
    const res = await model.call(formattedPrompt);
    return res;
}

const storeUserData = async function (userId, userPreference, queryContent, keywords) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO user_data (userId, userPreference, queryContent, keywords) VALUES (?, ?, ?, ?)`,
        [userId, userPreference, queryContent, keywords],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

const getUserData = async function (userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM user_data WHERE userId = ?", [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}


// function updatePreference(){
//     // TODO
// }

// function handleText(){
//     // TODO
// }


const handleUserQuery = async function (userId, queryContent, newPreference, keywords_list, model) {
    const user = await getUserData(userId)

    let userPreference;
    let keywords;

    if (user) {
        userPreference = user.userPreference;
        keywords = await extractKeywords(queryContent, userPreference, keywords_list, model)
        // console.log("Old user: ", keywords);
    } else {
        userPreference = newPreference; // Or however you handle new users
        keywords = await extractKeywords(queryContent, userPreference, keywords_list, model)
        // console.log("New user: ", keywords);
    }

    await storeUserData(userId, userPreference, queryContent, keywords);

    return keywords;
}

module.exports = {
  extractKeywords,
  extractKeywords_text,
  storeUserData,
  getUserData,
  handleUserQuery,
  db
};