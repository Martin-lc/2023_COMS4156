const { extractKeywords, storeUserData, getUserData, handleUserQuery, db } = require('../part1');

test('extractKeywords should concatenate queryContent and userPreference and join them with space', () => {
    const queryContent = 'latest news';
    const userPreference = 'technology news'; // Test duplicate
    const expected = 'latest, news, technology';
    const actual = extractKeywords(queryContent, userPreference);
    expect(actual).toEqual(expected);
});

test('storeUserData should store data without errors', done => {
    const userId = 'user123';
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords = extractKeywords(queryContent, userPreference);

    storeUserData(userId, userPreference, queryContent, keywords, err => {
        expect(err).toBeNull();
        done();
    });
});

test('getUserData should retrieve stored data', done => {
    const userId = 'user123';
    const userPreference = 'tech news';
    const queryContent = 'latest in tech';
    const keywords = extractKeywords(queryContent, userPreference);

    storeUserData(userId, userPreference, queryContent, keywords, err => {
        expect(err).toBeNull();

        getUserData(userId, (err, row) => {
            expect(err).toBeNull();
            expect(row.userId).toEqual(userId);
            expect(row.userPreference).toEqual(userPreference);
            expect(row.queryContent).toEqual(queryContent);
            expect(row.keywords).toEqual(keywords);
            done();
        });
    });
});

test('handleUserQuery should store data for new users and handle subsequent entries correctly', done => {
    
    const newUserId = 'user125';
    const firstQueryContent = 'breaking news';
    const secondQueryContent = 'economic news';
    const userPreference = 'news, sports';
    
    db.run(`DELETE FROM user_data WHERE userId = ?`, newUserId, function(err) {
        if (err) {
            return callback(err);
        }
        console.log(`Deleted ${this.changes} row(s)`);
        // callback(null, this.changes);
    });

    // First entry
    handleUserQuery(newUserId, firstQueryContent, userPreference, (err, data) => {
        expect(err).toBeNull();
        expect(data.userId).toEqual(newUserId);
        expect(data.queryContent).toEqual(firstQueryContent);
        expect(data.userPreference).toEqual(userPreference);

        // Second entry
        handleUserQuery(newUserId, secondQueryContent, userPreference, (err, data) => {
            expect(err).toBeNull();
            expect(data.userId).toEqual(newUserId);
            expect(data.userPreference).toEqual(userPreference);
            // Expecting both first and second query contents to be present
            expect(data.keywords).toEqual("breaking, news, sports, economic");
    
            done();
        });
    });

});



afterAll(() => {
    db.close(err => {
        if (err) {
            return console.error(err.message);
        }
    });
});
