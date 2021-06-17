const sqlite = require('sqlite3');
const path = require('path');

// DB初期設定
exports.initDbCreate = function initDbCreate() {
    let dbpath = path.join(__dirname, '../db/activity.db');
    let db = new sqlite.Database(dbpath);
    db.serialize(() => {
        let CREATE_TABLE_LINK = 'CREATE TABLE IF NOT EXISTS LINK'
            + '(id INTEGER PRIMARY KEY AUTOINCREMENT,'
            + ' linkName TEXT UNIQUE,'
            + 'url TEXT NOT NULL)';

        let CREATE_TABLE_ACTIVITY = 'CREATE TABLE IF NOT EXISTS ACTIVITY'
            + '(id INTEGER PRIMARY KEY AUTOINCREMENT,'
            + 'activityDateTime TEXT NOT NULL,'
            + 'category TEXT NOT NULL,'
            + 'contents TEXT NOT NULL,'
            + 'activityTime TEXT NOT NULL)';

        db.run(CREATE_TABLE_LINK);
        db.run(CREATE_TABLE_ACTIVITY);
    });
    db.close();
}
