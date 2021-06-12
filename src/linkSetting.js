'use strict'
import * as utility from './common/utility.js';

const setLinkSubmit = document.getElementById('setLinkSubmit');

const linkNameElements = document.getElementsByClassName('linkName');
const linkUrlElements = document.getElementsByClassName('linkUrl');

// 初期表示
window.onload = function () {
    let datas = utility.readFile('./src/settings/linkSetting.json');
    let [links, urls] = utility.convertAssociativeArrayToArray(datas);

    for (var i = 0; i < links.length; i++) {
        linkNameElements[i].value = links[i];
        linkUrlElements[i].value = urls[i];
    }
}

// Submit押下時
setLinkSubmit.addEventListener('click', function () {

    // 配列に変換　存在しなかったらLinkNameにNoneを設定
    let linkNameValues = isNullSetNoneName(utility.setArrayValues(linkNameElements));
    let linkUrlValues = utility.setArrayValues(linkUrlElements);

    // 連想配列に変換
    let linkNameAndUrls = utility.setAssociativeArray(linkNameValues, linkUrlValues);

    // ObjectをJsonに変換
    let jsonData = utility.convertObjectToJson(linkNameAndUrls);

    // 設定を書き込む
    utility.writeFile('./src/settings/linkSetting.json', jsonData);

    // メニューバーをreload
    ipcRenderer.send('reload');
}, false);

// リンクの名前が存在しなかったらデフォルトの名前を設定する処理
function isNullSetNoneName(values) {
    let count = 0;
    return values.map(value => {
        count++;
        return value ? value : "none" + count;
    });
}