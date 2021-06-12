const { BrowserWindow, app, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let linkSettingJson;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 360,
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

    let linkNames = Object.keys(linkSettingJson);

    let menu = new Menu();

    const links = new MenuItem(
        {
            label: 'Link',
            submenu: [
                {
                    label: 'Top',
                    click() { mainWindow.loadFile('./view/index.html'); }
                },
                {
                    label: linkNames[0],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[0]]); }
                },
                {
                    label: linkNames[1],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[1]]); }
                },
                {
                    label: linkNames[2],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[2]]); }
                },
                {
                    label: linkNames[3],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[3]]); }
                },
                {
                    label: linkNames[4],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[4]]); }
                },
                {
                    label: linkNames[5],
                    click() { createNewBrowser().loadURL(linkSettingJson[linkNames[5]]); }
                }
            ]
        },
    )

    const linkSetting = new MenuItem(
        {
            label: 'LinkSetting',
            click() { mainWindow.loadFile('./view/linkSetting.html'); }
        },
    )

    menu.append(links);
    menu.append(linkSetting);

    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow);

// 起動処理の完了時
app.on('will-finish-launching', () => {
    try {
        fs.statSync('./src/settings/linkSetting.json');
        console.log('ファイルが存在します');
    } catch (error) {
        const data = {
            "none1": "",
            "none2": "",
            "none3": "",
            "none4": "",
            "none5": "",
            "none6": ""
        }
        if (error.code === 'ENOENT') {
            console.log('ファイルは存在しません、作成します');
            fs.writeFileSync('./src/settings/linkSetting.json', JSON.stringify(data, null, 2));
        } else {
            console.log(error);
        }
    }
    linkSettingJson = JSON.parse(fs.readFileSync('./src/settings/linkSetting.json', 'utf8'));
    console.log(linkSettingJson);
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
    linkSettingJson = JSON.parse(fs.readFileSync('./src/settings/linkSetting.json', 'utf8'));
    initWindowMenu();
});