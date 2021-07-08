const dbSettings = require('../common/dbSettings');
const activityModel = require('../model/activity');

exports.activity = class Activity {
    // ユニークなcategoryを返却する
    static getUniqueCategory = function (obj, results) {
        if (!results.includes(obj.category)) {
            results.push(obj.category);
            return obj.category;
        }
    }

    static insert(data) {
        dbSettings.dbCommon.initDb();
        const db = dbSettings.dbCommon.get();
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                let stmt = db.prepare('INSERT INTO ACTIVITY (activityDateTime,category,contents,activityTime, activityDate) VALUES (?,?,?,?,?)');
                stmt.run(data.activityDateTime, data.category, data.contents, data.activityTime, data.activityDate);
                stmt.finalize((error) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve("INSERT_ACTIVITY");
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
                let query = 'SELECT * FROM ACTIVITY';
                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    }
                    if (rows.length > 0) {
                        let activitys = rows.map(row => {
                            return new activityModel.activity(row['activityDateTime'], row['category'], row['contents'], row['activityTime'], row['activityDate']);
                        });
                        return resolve(activitys);
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