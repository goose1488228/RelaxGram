const { app, BrowserWindow, shell, session } = require('electron');

const APP_URL = 'https://goose1488228.github.io/RelaxGram/';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 360,
    minHeight: 560,
    title: 'RelaxGram',
    autoHideMenuBar: true,
    backgroundColor: '#0a1020',
    webPreferences: {
      // Keep site storage (IndexedDB/localStorage) between app launches.
      partition: 'persist:relaxgram',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(APP_URL)) return { action: 'allow' };
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // The Chromium disk cache is kept in the persistent app session.
  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  const appSession = session.fromPartition('persist:relaxgram');
  appSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    // Do not grant permissions such as camera or microphone automatically.
    callback(false);
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
