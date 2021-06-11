// 配列に格納する処理
export function setArrayValues(element) {
    var values = [];
    for (var i = 0; i < element.length; i++) {
        values.push(element[i].value);
    }
    console.log(values);
    return values;
}

// 連想配列にする処理
export function setAssociativeArray(keys, values) {
    let data = {};
    for (var i = 0; i < keys.length; i++) {
        data[keys[i]] = values[i];
    }
    return data;
}

// objectをJsonに変換
export function convertObjectToJson(associativeArray) {
    return JSON.stringify(associativeArray);
}

// ファイル読込処理
export function readFile(filePath) {
    try {
        var datas = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.log(error.message);
    }
    return datas;
}

// 連想配列を配列にする処理
export function convertAssociativeArrayToArray(datas) {
    var keys = Object.keys(datas);
    var values = keys.map((data) => {
        return datas[data];
    });
    
    return [keys, values];
}

// ファイル書込処理
export function writeFile(filePath, data) {
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            dialog.showErrorBox(err.code + err.errno, err.message);
        } else {
            let w = remote.getCurrentWindow();
            let writeSuccessMessage = dialog.showMessageBox(w, {
                title: 'Message',
                message: 'リンクを保存しました',
            });
            console.log(writeSuccessMessage);
        }
    });
}