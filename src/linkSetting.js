'use strict'

import * as utility from './utility.js';

const setLinkSubmit = document.getElementById('setLinkSubmit');

const linkNameElements = document.getElementsByClassName('linkName');
const linkUrlElements = document.getElementsByClassName('linkUrl');

// Submit押下時
setLinkSubmit.addEventListener('click', function () {

    // 配列に変換　存在しなかったらLinkNameにNoneを設定
    let linkNameValues = isNullSetNoneName(utility.setArrayValues(linkNameElements));
    let linkUrlValues = utility.setArrayValues(linkUrlElements);

    // 連想配列に変換
    let linkNameAndUrls = utility.setAssociativeArray(linkNameValues, linkUrlValues);

    // ObjectをJsonに変換
    let jsonData = utility.convertObjectToJson(linkNameAndUrls);

    utility.writeFile('./src/settings/linkSetting.json', jsonData);
}, false);

// リンクの名前が存在しなかったらデフォルトの名前を設定する処理
function isNullSetNoneName(values) {
    let count = 0;
    return values.map(value => {
        count++;
        return value ? value : "none" + count;
    });
}