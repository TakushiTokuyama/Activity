const { BrowserWindow, app, Menu, MenuItem } = require('electron');
const path = require('path');

let mainWindow;
let linkSettingWindow;

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
                    label: 'GitHub',
                    click() { mainWindow.loadURL('https://github.com/'); }
                },
                {
                    label: 'HatenaBlog',
                    click() { mainWindow.loadURL('https://tokuty.hatenablog.com/'); }
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