const puppeteer = require('puppeteer');
const dbutils = require('./dbutils.js');

(async () => {
    var uninitialized = dbutils.getUnitialized();

    const browser = await puppeteer.launch({ headless: true }); // default is true
    const page = await browser.newPage();

    for (i = 0; i < uninitialized.length; i++) {
        await page.goto(uninitialized[i].url, {
            waitUntil: 'networkidle2',
        });
        // Get all links on the page
        const hrefs = await page.evaluate(() => {
            return Array.from(document.getElementsByTagName('a'), a => a.href);
        });
        //Write the base set of hrefs to the database for diffing
        dbutils.setBaseDiffUrls(uninitialized[i].id, JSON.stringify(hrefs));
        //Flag as initiazlized
        dbutils.setInitialized(uninitialized[i].id);
    }



    await browser.close();
})();