const setLinkSubmit = document.getElementById('setLinkSubmit');

const linkNameElements = document.getElementsByClassName('linkName');
const linkUrlElements = document.getElementsByClassName('linkUrl');

// Submit押下時
setLinkSubmit.addEventListener('click', function () {

    let linkNameValues = setArrayValues(linkNameElements);
    let linkUrlValues = setArrayValues(linkUrlElements);

}, false);

// Elementの値を配列に格納する処理
function setArrayValues(element) {
    var values = [];
    for (var i = 0; i < element.length; i++) {
        values.push(element[i].value);
    }
    console.log(values);
    return values;
}