const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const { desktopCapturer } = require('electron');
const screenshot = require('screenshot-desktop');
const fs = require('fs');

let mainWindow;
let tray = null;
let captureInterval = null;
let captureSettings = {
  active: false,
  interval: 5000,
  format: 'png',
  folder: app.getPath('downloads')
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  // Create tray icon
  createTray();

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Screenshot Capture');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('start-capture', async (event, settings) => {
  captureSettings = { ...captureSettings, ...settings, active: true };
  
  if (captureInterval) {
    clearInterval(captureInterval);
  }
  
  captureInterval = setInterval(async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `screenshot-${timestamp}.${captureSettings.format}`;
      const filePath = path.join(captureSettings.folder, filename);
      
      const img = await screenshot({ format: captureSettings.format });
      fs.writeFileSync(filePath, img);
      
      mainWindow.webContents.send('capture-success', filePath);
    } catch (error) {
      mainWindow.webContents.send('capture-error', error.message);
    }
  }, captureSettings.interval);
  
  return { success: true };
});

ipcMain.handle('stop-capture', () => {
  captureSettings.active = false;
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
  }
  return { success: true };
});

ipcMain.handle('get-settings', () => {
  return captureSettings;
});

ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    captureSettings.folder = result.filePaths[0];
    return { folder: result.filePaths[0] };
  }
  return { folder: captureSettings.folder };
});