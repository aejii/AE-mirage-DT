const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const removeFile = util.promisify(fs.unlink);

const appPath = path.join('./', 'app', 'index.html');

const height = 768;
const width = height * 2;

async function createWindow() {
  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: __dirname + '/app/assets/logo.ico',
  });

  const load = () => win.loadFile(appPath);

  load();
  // win.webContents.openDevTools();
  win.webContents.on('did-fail-load', () => load());
}

app.commandLine.appendSwitch('disable-site-isolation-trials');
app.whenReady().then(createWindow);
