const { BrowserWindow, app, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let linkSettingData;

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

    mainWindow.loadFile('./view/index.html');

    mainWindow.webContents.openDevTools();

    initWindowMenu();

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

    const links = new MenuItem(
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
            click() { mainWindow.loadFile('./view/linkSetting.html'); }
        },
    )

    // link設定
    if (linkSettingData !== "") {
        let linkNames = Object.keys(linkSettingData);
        linkNames.forEach((linkName) => (links.submenu.append(new MenuItem({ label: linkName, click() { createNewBrowser().loadURL(linkSettingJson[linkName]) } }))));
    }
    menu.append(links);
    menu.append(linkSetting);

    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow);

// 起動処理の完了時
app.on('will-finish-launching', () => {
    // 初期設定
    initSettings();
});

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

// メニューバーをreload
ipcMain.on('reload', (event, data) => {
    console.log('reload');
    linkSettingData = JSON.parse(fs.readFileSync('./src/settings/linkSetting.json', 'utf8'));
    initWindowMenu();
});

// windowを表示させる
ipcMain.on('show-window', (event, data) => {
    console.log('window-show');
    mainWindow.show();
});

// 初期設定
function initSettings() {
    try {
        fs.statSync('./src/settings/linkSetting.json');
        console.log('ファイルが存在します');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('ファイルは存在しません、作成します');
            fs.writeFileSync('./src/settings/linkSetting.json', "");
        } else {
            console.log(error);
        }
    } finally {
        var linkSettingFile = fs.readFileSync('./src/settings/linkSetting.json', 'utf8');
        linkSettingData = linkSettingFile === "" ? "" : JSON.parse(linkSettingFile);
    }

    try {
        fs.statSync('./src/data/activity.json');
        console.log('ファイルが存在します');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('ファイルは存在しません、作成します');
            fs.writeFileSync('./src/data/activity.json', "");
        } else {
            console.log(error);
        }
    }
}