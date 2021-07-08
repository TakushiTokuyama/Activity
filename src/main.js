const { BrowserWindow, app, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');
const dbSetttings = require('./common/dbSettings');
const linkEntity = require('./entity/link');
const activityEntity = require('./entity/activity');
const utility = require('./common/utility');
const modelLink = require('./model/link');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 550,
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
            // 初期化
            linkMenu.submenu = null;
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
ipcMain.on('getCategory', (event, data) => {
    console.log('getCategory');
    dbSetttings.dbCommon.initDb();
    activityEntity.activity.findAll().then((activity) => {
        // 重複しないcategoryを返却
        var category = utility.noDuplicationObjectValues(activity, activityEntity.activity.getUniqueCategory);
        mainWindow.webContents.send('setCategory', category);
        mainWindow.webContents.send('setActivity', activity);
    });
});

// activityを取得
ipcMain.on('getWeekActivity', (event, data) => {
    console.log('getWeekActivity');
    dbSetttings.dbCommon.initDb();
    activityEntity.activity.findAll().then((activity) => {
        mainWindow.webContents.send('sendActivity', activity);
    });
});

// insertActivityData
ipcMain.on('insertActivity', (event, data) => {
    console.log('insertActivity');
    activityEntity.activity.insert(data);
});

// findLinkData
ipcMain.on('findLinkData', (event, data) => {
    console.log('findLinkData');
    dbSetttings.dbCommon.initDb();
    linkEntity.link.findAll().then((links) => {
        mainWindow.webContents.send('setLinkData', links);
    });
});

// insertLinkData
ipcMain.on('insertLink', (event, data) => {
    console.log('insertLink');
    linkEntity.link.insert(data);
});

// windowMenuを初期化
ipcMain.on('initWindowMenu', (event, data) => {
    console.log('initWindowMenu');
    initWindowMenu();
});

// windowを表示させる
ipcMain.on('show-window', (event, data) => {
    console.log('window-show');
    mainWindow.show();
});


