const puppeteer = require('puppeteer');

jest.setTimeout(10000);

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true }); 
    page = await browser.newPage();
}, 10000);

afterAll(async () => {
    if (browser) {
        await browser.close();
    }
});

test('submit form and show results', async () => {
    await page.goto('http://localhost:8080');

    await page.type('#query', 'I want to learn about long COVID symptoms');
    await page.type('#userPreference', 'wellness,elder,covid,nutrition');
    await page.type('#record_num', '2');
    await page.click('button[type="submit"]');

    await page.waitForSelector('#results', { visible: true });

    const resultsText = await page.$eval('#results', el => el.textContent);
    expect(resultsText).toContain('COVID');
}, 30000);

