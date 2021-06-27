import * as dialogBox from '../common/dialogBox.js';

const setLinkSubmit = document.getElementById('setLinkSubmit');

const linkNameElements = document.getElementsByClassName('linkName');
const linkUrlElements = document.getElementsByClassName('linkUrl');

// 初期表示
document.addEventListener('DOMContentLoaded', function () {
    // メインプロセスに送信
    ipcRenderer.send('findLinkData');
    // メインプロセスからデータを受信
    ipcRenderer.on('setLinkData', (event, datas) => {
        if (0 < datas.length) {
            createLinkSettingHtml(0);
            datas.forEach((data) => {
                linkNameElements[data.linkId].value = data.linkName;
                linkUrlElements[data.linkId].value = data.url;
                if (7 < data.linkId) {
                    return;
                }
                createLinkSettingHtml(data.linkId + 1);
            });
        } else {
            // データが無い場合の初期設定
            createLinkSettingHtml(0);
        }
    });
});

// Submit押下時
setLinkSubmit.addEventListener('click', function () {

    // 配列に変換
    let linkNameValues = utility.setArrayValues(linkNameElements);
    let linkUrlValues = utility.setArrayValues(linkUrlElements);

    // モデルに詰替え
    let linkNameAndUrls = convertArrayToModel(modelLink, linkNameValues, linkUrlValues);

    // メインプロセスに送信
    ipcRenderer.send('insertLink', linkNameAndUrls);

    // dialog表示
    dialogBox.message(CONSTANTS.TITLE.FILE_SAVE, CONSTANTS.MESSAGE.FILE_SAVE);

    // pageをreload
    ipcRenderer.send('reload');
}, false);

// linkSetting用のHtmlを生成する
function createLinkSettingHtml(index) {

    var linkSettingHtml = '<div class="input-group vertical-top-5">'
        + '<div class="col-2">'
        + `<span class="input-group-text btn-danger">LinkSetting_${index}</span>`
        + '</div>'
        + '<div class="col-4">'
        + '<input type="text" aria-label="Link" class="form-control linkName" placeholder="LinkName">'
        + '</div>'
        + '<div class="col-6">'
        + '<input type="text" aria-label="URL" class="form-control linkUrl" placeholder="URL">'
        + '</div>'
        + '</div>';
    let linkSettingForm = document.getElementById('linkSettingForm');
    let mainDiv = document.createElement('div');
    mainDiv.innerHTML = linkSettingHtml;
    linkSettingForm.appendChild(mainDiv);
}

// モデルに詰替えする処理
function convertArrayToModel(model, links, urls) {
    var data = [];

    for (var i = 0; i < links.length; i++) {
        data.push(new model.link(i, links[i], urls[i]));
    }
    return data;
}