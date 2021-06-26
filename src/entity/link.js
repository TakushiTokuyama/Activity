const dbSettings = require('../common/dbSettings');
const modelLink = require('../model/link');

exports.link = class Link {
    static insert(datas) {
        dbSettings.dbCommon.initDb();
        const db = dbSettings.dbCommon.get();
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let stmt = db.prepare('INSERT INTO LINK (linkId,linkName,url) VALUES (?,?,?) ON CONFLICT(linkId) DO UPDATE SET linkName = excluded.linkName ,url = excluded.url');
                datas.forEach((data) => {
                    stmt.run(data.linkId, data.linkName, data.url);
                });

                stmt.finalize((error) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve("INSERT_LINK");
                });
            });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            db.close((error) => {
                if (error) {
                    console.error(error);
                }
                console.log('Close the database connection.');
            });
        });
    }

    // 全件検索
    static findAll() {
        const db = dbSettings.dbCommon.get();
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let query = 'SELECT * FROM LINK';
                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    }
                    if (rows.length > 0) {
                        var links = rows.map(row => {
                            return new modelLink.link(row['linkId'], row['linkName'], row['url']);
                        });
                        return resolve(links);
                    }
                    return resolve(rows);
                });
            });
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            db.close((error) => {
                if (error) {
                    console.error(error);
                }
                console.log('Close the database connection.');
            });
        });
    }
}