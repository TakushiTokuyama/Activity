// 配列に格納する処理
exports.setArrayValues = function setArrayValues(element) {
    var values = [];
    for (var i = 0; i < element.length; i++) {
        values.push(element[i].value);
    }
    console.log(values);
    return values;
}

// 連想配列にする処理
exports.setAssociativeArray = function setAssociativeArray(keys, values) {
    let data = {};
    for (var i = 0; i < keys.length; i++) {
        data[keys[i]] = values[i];
    }
    return data;
}

// objectをJsonに変換
exports.convertObjectToJson = function convertObjectToJson(associativeArray) {
    return JSON.stringify(associativeArray, null, 2);
}

// ファイル読込処理
exports.readFile = function readFile(filePath) {
    try {
        var datas = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.log(error.message);
    }
    return datas;
}

// 連想配列を配列にする処理
exports.convertAssociativeArrayToArray = function convertAssociativeArrayToArray(datas) {
    var keys = Object.keys(datas);
    var values = keys.map((data) => {
        return datas[data];
    });

    return [keys, values];
}

// ファイル書込処理
exports.writeFile = function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
    } catch (ex) {
        console.log(ex);
    }
}

// 重複しない値を返却
exports.noDuplicationObjectValues = function noDuplicationObjectValues(object, getUniqueObj) {
    let results = [];
    results = object.map((obj) => {
        return getUniqueObj(obj, results);
    }).filter(Boolean);
    return results
}