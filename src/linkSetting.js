// 現在のwindowを呼び出す
const currentWindow = window.remote.getCurrentWindow();
const Menu = window.remote.Menu;

const setLinkSubmit = document.getElementById('setLinkSubmit');

// Submit押下時
setLinkSubmit.addEventListener('click', function () {
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