const { app, BrowserWindow } = require('electron');
const path = require('path');

const appPath = path.join('./', 'app', 'index.html');

const height = 768;
const width = height * 2;

function createWindow() {
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: __dirname + '/app/assets/logo.ico'
  });

  const load = () => win.loadFile(appPath);

  load();
  // win.webContents.openDevTools();
  win.webContents.on('did-fail-load', () => load());
}

app.commandLine.appendSwitch('disable-site-isolation-trials');
app.whenReady().then(createWindow);
