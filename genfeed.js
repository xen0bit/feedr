const fs = require('fs');
const Feed = require('feed').Feed;
const dbutils = require('./dbutils.js');


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


  console.log(feed.rss2());
  fs.writeFileSync("feeds/" + feedSources[feedIndex].id + ".xml", feed.rss2());
}
