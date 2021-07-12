const puppeteer = require('puppeteer');
const dbutils = require('./dbutils.js');

(async () => {
    var uninitialized = dbutils.getInitialized();

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
        
        basehrefs = dbutils.getBaseDiffUrls(uninitialized[i].id);
        const regex = uninitialized[i].indexfilter;
        const matchedHrefs = hrefs.filter(href => !href.match(regex));
        //console.log(matchedHrefs);

        //Diff
        for(x=0; x<matchedHrefs.length; x++){
            if(!basehrefs[0].basehrefs.includes(matchedHrefs[x])){
                console.log(matchedHrefs[x]);
                dbutils.insertQueue(uninitialized[i].id, matchedHrefs[x]);
            }
        }

        dbutils.updateBaseDiffUrls(uninitialized[i].id, JSON.stringify(hrefs));
    }



    await browser.close();
})();