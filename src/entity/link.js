const dbSettings = require('../common/dbSettings');

class link {
    constructor(id, linkName, url) {
        this.id = id;
        this.linkName = linkName;
        this.url = url;
    }
}

// 全件検索
exports.findAll = function findAll() {
    const links = [];
    return new Promise((resolve, reject) => {
        dbSettings.connection.serialize(() => {
            let query = 'SELECT * FROM LINK';
            dbSettings.connection.all(query, (error, rows) => {
                if (error) {
                    reject(error);
                }
                rows.forEach(row => {

                    links.push(new link(row['id'], row['linkName'], row['url']));
                });
                return resolve(links);
            });
        });
        dbSettings.connection.close();
    }).catch((error) => {
        console.log(error);
    });
}