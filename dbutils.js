const db = require('better-sqlite3')('feedr.db', { verbose: console.log });

exports.getUnitialized = () => {
    const row = db.prepare('SELECT * FROM sourceurls where initialized = 0').all();
    console.log(row);
    return row
};

exports.getInitialized = () => {
    const row = db.prepare('SELECT * FROM sourceurls where initialized = 1').all();
    console.log(row);
    return row
};

exports.setInitialized = (sourceid) => {
    const stmt = db.prepare('UPDATE sourceurls SET initialized = 1 WHERE id = ?');
    stmt.run(sourceid);
};

exports.getBaseDiffUrls = (sourceid) => {
    const row = db.prepare('SELECT * FROM basediff where sourceid = ?').all(sourceid);
    //console.log(row);
    return row
};

exports.setBaseDiffUrls = (sourceid, json) => {
    const stmt = db.prepare('INSERT INTO basediff (sourceid, basehrefs) VALUES (?, ?)');
    stmt.run(sourceid, json);
};

exports.updateBaseDiffUrls = (sourceid, json) => {
    const stmt = db.prepare('UPDATE basediff SET basehrefs = ? where sourceid = ?');
    stmt.run(json, sourceid);
};

exports.insertQueue = (sourceid, url) => {
    const stmt = db.prepare('INSERT INTO queue (sourceid, url) VALUES (?, ?)');
    stmt.run(sourceid, url);
};

exports.removeQueue = (id) => {
    const stmt = db.prepare('DELETE from queue WHERE id = ?');
    stmt.run(id);
};

exports.getQueue = () => {
    const row = db.prepare('SELECT * FROM queue').all();
    console.log(row);
    return row
};

exports.insertExportData = (sourceid, title, url, text, lastmodified) => {
    const stmt = db.prepare('INSERT INTO export (sourceid, title, url, text, lastmodified) VALUES (?, ?, ?, ?, ?)');
    stmt.run(sourceid, title, url, text, lastmodified);
};

exports.getFeedInfo = () => {
    const row = db.prepare('select * FROM sourceurls').all();
    //console.log(row);
    return row
};

exports.getExportRSS = (sourceid) => {
    const stmt = db.prepare('select * FROM sourceurls INNER JOIN export on sourceurls.id = export.sourceid WHERE export.sourceid = ? ORDER by lastmodified DESC').all(sourceid);
    //console.log(row);
    return stmt
};
