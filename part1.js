const sqlite3 = require('sqlite3').verbose();

// Initialize database.
let db = new sqlite3.Database('./user_data.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS user_data (userId TEXT UNIQUE, userPreference TEXT, queryContent TEXT, keywords TEXT)");
});

// TODO: Only naive extraction now; add LLM keywords summary
function extractKeywords(queryContent, userPreference) {
    let keywords = queryContent.split(/[\s,]+/).concat(userPreference.split(/[\s,]+/));
    keywords = Array.from(new Set(keywords));

    return keywords.join(', ');
}

function storeUserData(userId, userPreference, queryContent, keywords, callback) {
    db.run(`INSERT OR REPLACE INTO user_data (userId, userPreference, queryContent, keywords) VALUES (?, ?, ?, ?)`,
        [userId, userPreference, queryContent, keywords],
        callback
    );
}

function getUserData(userId, callback) {
    db.get("SELECT * FROM user_data WHERE userId = ?", [userId], callback);
}

function handleUserQuery(userId, queryContent, newPreference, callback) {
    getUserData(userId, (err, user) => {
        if (err) {
            return callback(err);
        }

        let userPreference;
        let keywords;

        if (user) {
            userPreference = user.userPreference;

            // Checking for existing content and keywords, avoiding duplication
            queryContent = user.queryContent.split(/[\s,]+/).concat(queryContent)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(', ');
                
            keywords = user.keywords.split(/[\s,]+/).concat(extractKeywords(queryContent, userPreference).split(/[\s,]+/))
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(', ');

            console.log("Old user: ", keywords);
        } else {
            userPreference = newPreference; // Or however you handle new users
            keywords = extractKeywords(queryContent, userPreference);
            console.log("New user: ", keywords);
        }

        storeUserData(userId, userPreference, queryContent, keywords, err => {
            callback(err, { userId, userPreference, queryContent, keywords });
        });
    });
}

module.exports = {
    extractKeywords,
    storeUserData,
    getUserData,
    handleUserQuery,
    db // expose for closing after tests
};
