const { app, BrowserWindow } = require('electron');
const path = require('path');

const appPath = path.join(__dirname, '..', 'www', 'index.html');

const height = 768;
const width = height * 2.5;

function createWindow() {
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile(appPath);
  win.webContents.openDevTools();
  win.webContents.on('did-fail-load', () => win.loadFile(appPath));
}

app.commandLine.appendSwitch('disable-site-isolation-trials');
app.whenReady().then(createWindow);
