const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const removeFile = util.promisify(fs.unlink);

const appPath = path.join('./', 'app', 'index.html');
const partitionsCounter = path.join(__dirname, 'instances-count.txt');

const height = 768;
const width = height * 2;

async function createWindow() {
  let partition = 0;

  if (!fs.existsSync(partitionsCounter))
    await writeFile(partitionsCounter, '1');
  else {
    partition = +(await readFile(partitionsCounter)).toString();
    await writeFile(partitionsCounter, `${partition + 1}`);
  }

  let win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      partition: 'persist:' + partition,
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

app.on('before-quit', async () => {
  const partitions = +(await readFile(partitionsCounter)).toString();
  if (partitions === 1) await removeFile(partitionsCounter);
  else await writeFile(partitionsCounter, `${partitions - 1}`);
});
