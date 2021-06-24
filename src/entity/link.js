const dbSettings = require('../common/dbSettings');

exports.link = class Link {
    static links = [];
    constructor(linkId, linkName, url) {
        this.linkId = linkId;
        this.linkName = linkName;
        this.url = url;
    }

    static insert(data) {
        dbSettings.dbCommon.initDb();
        const db = dbSettings.dbCommon.get();
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let stmt = db.prepare('INSERT OR REPLACE INTO LINK (linkName,url) VALUES (?,?)');

                Object.keys(data).forEach((key) => {
                    stmt.run(key, data[key]);
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
                        rows.forEach(row => {
                            this.links.push(new Link(row['linkName'], row['url']));
                        });
                    }
                    return resolve(this.links);
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