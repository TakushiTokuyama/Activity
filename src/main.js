const { BrowserWindow, app, Menu } = require('electron');
const path = require('path');

let mainWindow;

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

    mainWindow.loadFile('index.html');

    mainWindow.webContents.openDevTools();

    initWindowMenu();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// MenuBar
function initWindowMenu() {
    const template = [
        {
            label: 'Link',
            submenu: [
                {
                    label: 'Top',
                    click() { mainWindow.loadFile('index.html'); }
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
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// macos終了処理
app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});