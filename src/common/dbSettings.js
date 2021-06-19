const sqlite = require('sqlite3');
const path = require('path');

const dbpath = path.join(__dirname, '../db/activity.db');
const db = new sqlite.Database(dbpath);

exports.connection = db;

// DB初期設定
exports.initDbCreate = function initDbCreate() {
    return new Promise((resolve, reject) => {
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

            db.run(CREATE_TABLE_LINK, (error, res) => {
                if (error) {
                    reject(error);
                }
            });

            db.run(CREATE_TABLE_ACTIVITY, error => {
                if (error) {
                    reject(error);
                }
            });
        });
    }).catch((error) => {
        console.log(error);
    });
}