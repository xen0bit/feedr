const db = require('better-sqlite3')('feedr.db', { verbose: console.log });


exports.insertSourceUrl = (friendlyname, url, indexfilter) => {
    const stmt = db.prepare('INSERT INTO sourceurls (friendlyname, url, initialized, indexfilter) VALUES (?, ?, 0, ?)');
    stmt.run(friendlyname, url, indexfilter);
};

exports.getOpml = () => {
    const stmt = db.prepare('select id from sourceurls order by id asc').all();
    return stmt
};