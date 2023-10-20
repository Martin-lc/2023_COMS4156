const { generateRelatedWords, countWordOccurrences, scoreContent, rankContents, getTopContent } = require('../content_ranker/part4.js');
// Mocking the llm.predict method to return a fixed value for testing
jest.mock("langchain/llms/openai", () => {
    return {
        OpenAI: jest.fn().mockImplementation(() => {
            return {
                predict: jest.fn().mockResolvedValue("love, joy, happiness, affection, elation")
            };
        })
    };
});

describe("Testing functions from part4.js", () => {
    
    test("generateRelatedWords function", async () => {
        const result = await generateRelatedWords("love, happiness, joy");
        expect(result.originalWords).toEqual(["love", "happiness", "joy"]);
        
    });

    test("countWordOccurrences function", () => {
        const count = countWordOccurrences("love", "I love coding and love testing");
        expect(count).toBe(2);
    });

    // test("scoreContent function", () => {
    //     const score = scoreContent(["love", "happiness"], "I love coding. It brings me happiness.");
    //     expect(score).toBe(2);
    // });

    // test("rankContents function", () => {
    //     const contents = [
    //         "I love coding.",
    //         "Happiness is key.",
    //         "I love coding and it brings me happiness."
    //     ];
    //     const ranked = rankContents(contents, ["love", "happiness"]);
    //     expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    // });

    test("getTopContent function", async () => {
        const contents = [
            "In today's fast-paced world, the importance of health has never been more emphasized. With increasing pollution levels and the rise of sedentary lifestyles, many people are now turning to holistic approaches to maintain their health. Regular exercise, a balanced diet, and meditation have become the cornerstone of a healthy life. On the other hand, technology has seen unprecedented advancements. From the smartphones we use every day to the sophisticated AI-driven machinery, technology is reshaping the way we live, work, and play. It's fascinating to see how technology is being integrated into healthcare, revolutionizing diagnostics and treatment methods. But amidst all this hustle and bustle, music remains our soul's solace. The harmonious melodies, the powerful lyrics, they transport us to a different world. Many studies have shown the therapeutic benefits of music. Whether it's the beats of a drum, the strumming of a guitar, or the keys of a piano, music has a way to heal and connect.",
            "The intersection of health and technology is one of the most promising realms of modern society. Wearable devices that monitor heart rates, blood pressure, and even sleep patterns are becoming common. These gadgets, driven by sophisticated technology, not only help individuals keep track of their health metrics but also provide data to healthcare professionals for better diagnosis. In contrast, music, an age-old form of expression and entertainment, is also being transformed by technology. Digital music platforms, sound engineering software, and even AI-composed melodies are changing the landscape of the music industry. But no matter how advanced technology becomes, the essence of music, its rhythm, its soul, remains unchanged. It's a testament to how even in a world driven by bytes and bits, the human touch, the raw emotion of a musical note, still holds a special place.",
            "As the dawn of a new decade approaches, the world stands at the cusp of a revolution driven by health, technology, and music. The global health industry is undergoing a paradigm shift with the introduction of telemedicine, robotic surgeries, and personalized treatments based on genetic makeup. Technology acts as the backbone of this transformation. From cloud databases storing patient records to AI algorithms predicting disease outbreaks, technology is the unsung hero. But life isn't just about progress and advancements; it's also about finding joy in the little moments. That's where music comes in. The soothing tunes of a violin, the energetic beats of electronic dance music, or the nostalgic chords of classic rock, music is the universal language of emotion. And with technology, accessing and creating music has become easier than ever. It's truly a harmonious blend of the past, present, and future."
        ];
        const topContent = await getTopContent("health,technology,music", contents);
        expect(topContent).toBe("As the dawn of a new decade approaches, the world stands at the cusp of a revolution driven by health, technology, and music. The global health industry is undergoing a paradigm shift with the introduction of telemedicine, robotic surgeries, and personalized treatments based on genetic makeup. Technology acts as the backbone of this transformation. From cloud databases storing patient records to AI algorithms predicting disease outbreaks, technology is the unsung hero. But life isn't just about progress and advancements; it's also about finding joy in the little moments. That's where music comes in. The soothing tunes of a violin, the energetic beats of electronic dance music, or the nostalgic chords of classic rock, music is the universal language of emotion. And with technology, accessing and creating music has become easier than ever. It's truly a harmonious blend of the past, present, and future.");
    });

});

