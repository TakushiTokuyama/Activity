const { BrowserWindow, app, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const dbSetttings = require('./common/dbSettings');
const linkEntity = require('./entity/link');
const activityEntity = require('./entity/activity');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    // DB初期処理
    dbSetttings.dbCommon.initDb();
    dbSetttings.dbCommon.initTableCreate();

    // MenuBar初期処理
    initWindowMenu();

    mainWindow.loadFile('./view/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.center();

    console.log('createBrowserWindow');

    // Windowを閉じるときの処理
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// MenuBar
function initWindowMenu() {
    let menu = new Menu();

    const linkMenu = new MenuItem(
        {
            label: 'Link',
            submenu: [
                {
                    label: 'Top',
                    click() { mainWindow.loadFile('./view/index.html'); }
                },
            ]
        },
    )

    const linkSetting = new MenuItem(
        {
            label: 'LinkSetting',
            click() { mainWindow.loadFile('./view/linkSetting.html'); mainWindow.send('linkData', linkEntity.link.links); }
        },
    )

    // link設定
    linkEntity.link.findAll().then((links) => {
        if (links.length > 0) {
            links.forEach((link) => (linkMenu.submenu.append(new MenuItem({ label: link.linkName, click() { createNewBrowser().loadURL(link.url) } }))));
        }
    });

    menu.append(linkMenu);
    menu.append(linkSetting);

    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow);

// macos終了処理
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// macos
app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});

// 新しいWindowを生成
function createNewBrowser() {
    var linkWindow = new BrowserWindow({
        width: 800,
        height: 360,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: false,
        },
    });

    return linkWindow;
}

// activityを取得
ipcMain.on('getActivity', (event, data) => {
    console.log('getActivity');
    dbSetttings.dbCommon.initDb();
    activityEntity.activity.findAll().then((category) => {
        mainWindow.webContents.send('setActivity', category);
        // 初期化
        activityEntity.activity.category = [];
    });
});

// insertActivityData
ipcMain.on('insertActivity', (event, data) => {
    console.log('insertActivity');
    activityEntity.activity.insert(data);
});

// insertLinkData
ipcMain.on('insertLink', (event, data) => {
    console.log('insertLink');
    linkEntity.link.insert(data);
});

// メニューバーをreload
ipcMain.on('reload', (event, data) => {
    console.log('reload');
    initWindowMenu();
});

// windowを表示させる
ipcMain.on('show-window', (event, data) => {
    console.log('window-show');
    mainWindow.show();
});


