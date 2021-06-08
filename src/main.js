const { BrowserWindow, app, Menu, MenuItem } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let linkSettingWindow;
let linkSettingJson;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 360,
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

    // Windowサイズを固定
    mainWindow.on('will-resize', (event) => {
        event.preventDefault();
        console.log("NotResize");
    });

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
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[0]]); }
                },
                {
                    label: linkNames[1],
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[1]]); }
                },
                {
                    label: linkNames[2],
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[2]]); }
                },
                {
                    label: linkNames[3],
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[3]]); }
                },
                {
                    label: linkNames[4],
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[4]]); }
                },
                {
                    label: linkNames[5],
                    click() { mainWindow.loadURL(linkSettingJson[linkNames[5]]); }
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