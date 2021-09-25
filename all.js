const puppeteer = require('puppeteer');
const dbutils = require('./dbutils.js');
const fs = require('fs');
const Feed = require('feed').Feed;

(async () => {
    //Initialize
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
    //await browser.close();

    //Diff
    var uninitialized = dbutils.getInitialized();

    //const browser = await puppeteer.launch({ headless: true }); // default is true
    //const page = await browser.newPage();

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
        for (x = 0; x < matchedHrefs.length; x++) {
            if (!basehrefs[0].basehrefs.includes(matchedHrefs[x])) {
                console.log(matchedHrefs[x]);
                dbutils.insertQueue(uninitialized[i].id, matchedHrefs[x]);
            }
        }

        dbutils.updateBaseDiffUrls(uninitialized[i].id, JSON.stringify(hrefs));
    }
    //await browser.close();

    //Crawl
    var queue = dbutils.getQueue();

    //const browser = await puppeteer.launch({ headless: true }); // default is true
    //const page = await browser.newPage();

    for (i = 0; i < queue.length; i++) {
        try {
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
        catch {
            console.log("Failed to fetch: " + queue[i].url);
            dbutils.removeQueue(queue[i].id);
        }

    }
    await browser.close();

    //genFeed
    const feedSources = dbutils.getFeedInfo();

    for (feedIndex = 0; feedIndex < feedSources.length; feedIndex++) {
        console.log(feedSources[feedIndex]);
        const exportablesRSS = dbutils.getExportRSS(feedSources[feedIndex].id);

        const feed = new Feed({
            title: feedSources[feedIndex].friendlyname,
            description: feedSources[feedIndex].friendlyname,
            id: feedSources[feedIndex].id,
            link: feedSources[feedIndex].url,
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "https://remyhax.xyz/image/profile.jpg",
            favicon: "https://remyhax.xyz/image/favicon.ico",
            copyright: "DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE",
            generator: "awesome", // optional, default = 'Feed for Node.js'
            // feedLinks: {
            //   json: "https://remyhax.xyz/rss/json1.json",
            //   atom: "https://remyhax.xyz/rss/atom1.json"
            // },
            author: {
                name: "Remy",
                email: "remy@muvr.xyz",
                link: "https://remyhax.xyz/"
            }
        });

        exportablesRSS.forEach(post => {
            feed.addItem({
                title: post.title,
                id: post.url,
                link: post.url,
                content: post.text,
                date: new Date(post.lastmodified)
                // image: post.image
            });
        });


        //console.log(feed.rss2());
        fs.writeFileSync("./public/feeds/" + feedSources[feedIndex].id + ".xml", feed.rss2());
    }

})();