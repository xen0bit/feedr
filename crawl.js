const puppeteer = require('puppeteer');
const dbutils = require('./dbutils.js');

(async () => {
    var queue = dbutils.getQueue();

    const browser = await puppeteer.launch({ headless: true }); // default is true
    const page = await browser.newPage();

    for (i = 0; i < queue.length; i++) {
        try{
            await page.goto(queue[i].url, {
                waitUntil: 'networkidle2',
            });
            // Get all links on the page
            const pageInfo = await page.evaluate(() => {
                return {
                    title: document.title,
                    text: document.body.innerText
                };
            });
    
            var lastmodified = Date.now();
            dbutils.insertExportData(queue[i].sourceid, pageInfo.title, queue[i].url, pageInfo.text, lastmodified);
            dbutils.removeQueue(queue[i].id);
        }
        catch{
            console.log("Failed to fetch: " + queue[i].url);
        }

    }



    await browser.close();
})();