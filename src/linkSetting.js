// 現在のwindowを呼び出す
const currentWindow = window.remote.getCurrentWindow();
const Menu = window.remote.Menu;

const setLinkSubmit = document.getElementById('setLinkSubmit');

const linkNameElements = document.getElementsByClassName('linkName');
const linkUrlElements = document.getElementsByClassName('linkUrl');

// Submit押下時
setLinkSubmit.addEventListener('click', function () {

    let linkNameValues = setArrayValues(linkNameElements);
    let linkUrlValues = setArrayValues(linkUrlElements);

    let menus = new window.remote.Menu();

    const links = new window.remote.MenuItem(
        {
            label: 'Link',
            submenu: [
                {
                    label: 'Top',
                    click() { currentWindow.loadFile('./view/index.html'); }
                },
                {
                    label: 'GitHub',
                    click() { currentWindow.loadURL('https://github.com/'); }
                },
                {
                    label: 'HatenaBlog',
                    click() { currentWindow.loadURL('https://tokuty.hatenablog.com/'); }
                }
            ]
        },
    )

    const linkSetting = new window.remote.MenuItem(
        {
            label: 'LinkSetting',
            click() { currentWindow.loadFile('./view/index.html'); }
        },
    )

    menus.append(links);
    menus.append(linkSetting);

    Menu.setApplicationMenu(menus)
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