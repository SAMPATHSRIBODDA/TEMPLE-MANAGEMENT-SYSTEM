import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Disable hardware acceleration to prevent GPU crashes on some Windows machines
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  fs.writeFileSync(path.join(app.getPath('desktop'), 'tms-crash-log.txt'), 'Exception: ' + (err.stack || err.toString()));
  dialog.showErrorBox('Application Crash', 'A critical error occurred: ' + (err.message || err.toString()));
});

process.on('unhandledRejection', (err: any) => {
  console.error('Unhandled Rejection:', err);
  fs.writeFileSync(path.join(app.getPath('desktop'), 'tms-crash-log2.txt'), 'Rejection: ' + (err?.stack || err?.toString()));
  dialog.showErrorBox('Unhandled Rejection', 'A background task failed: ' + (err?.message || err?.toString()));
});

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL && !app.isPackaged) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // Automatically load dist/index.html
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // win.webContents.openDevTools();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.whenReady().then(createWindow);
