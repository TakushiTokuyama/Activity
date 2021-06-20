const sqlite = require('sqlite3');
const path = require('path');

exports.dbCommon = class DbCommon {
    static db;

    static initDb() {
        const dbpath = path.join(__dirname, '../db/activity.db');
        this.db = new sqlite.Database(dbpath, (err) => {
            if (err) {
                console.err(err.message);
            }
            console.log('Connected to the activity database.');
        });
    }

    static get() {
        return this.db;
    }

    // DB初期設定
    static initTableCreate() {
        const db = this.db;
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let CREATE_TABLE_LINK = 'CREATE TABLE IF NOT EXISTS LINK'
                    + '(linkName TEXT PRIMARY KEY,'
                    + 'url TEXT NOT NULL)';

                let CREATE_TABLE_ACTIVITY = 'CREATE TABLE IF NOT EXISTS ACTIVITY'
                    + '(id INTEGER PRIMARY KEY AUTOINCREMENT,'
                    + 'activityDateTime TEXT NOT NULL,'
                    + 'category TEXT NOT NULL,'
                    + 'contents TEXT NOT NULL,'
                    + 'activityTime TEXT NOT NULL)';

                db.run(CREATE_TABLE_LINK, (error) => {
                    if (error) {
                        reject(error);
                    }
                    return resolve("CREATE_TABLE_LINK");
                });

                db.run(CREATE_TABLE_ACTIVITY, error => {
                    if (error) {
                        reject(error);
                    }
                    return resolve("CREATE_TABLE_ACTIVITY");
                });
            });
        }).then((message) => {
            console.info(message);
        }).catch((error) => {
            console.log(error);
        });
    }
}
