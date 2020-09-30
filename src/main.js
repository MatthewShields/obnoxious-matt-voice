const { app, BrowserWindow, systemPreferences, Menu, Tray } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


let tray = null;

const createWindow = () => {
  console.log('create');
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    titleBarStyle: 'customButtonsOnHover',
    visibleOnAllWorkspaces: true,
    hasShadow: false,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      // mainWindow.webContents.openDevTools();

  mainWindow.webContents.once('dom-ready', () => {
      // Open the DevTools.

      // systemPreferences.askForMediaAccess('microphone').then((isAllowed) => {
      //   if(isAllowed) {
      //     mainWindow.webContents.send('info2', { msg: 'hello from main process' });
      //   }
      // });

      app.whenReady().then(() => {
        tray = new Tray('src/16.png')
        const contextMenu = Menu.buildFromTemplate([
          { label: 'Item1', type: 'radio' },
          { label: 'Item2', type: 'radio' },
          { label: 'Item3', type: 'radio', checked: true },
          { label: 'Item4', type: 'radio' }
        ])
        tray.setToolTip('This is my application.')
        tray.setContextMenu(contextMenu)
      })
    });



};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
