const { app, BrowserWindow, systemPreferences, Menu, Tray } = require('electron');
const path = require('path');
const Store = require('./store.js');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


let tray = null;
let mainWindow = false;

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    size: 'Large'
  }
});

const handleMenuItemClick = (menuItem, browserWindow, event) => {
  store.set('size', menuItem.label);
}




const setupApp = () => {
  
  createWindow();

  let size = store.get('size');


  tray = new Tray(path.join(__dirname, '16.png'))
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Large', click: handleMenuItemClick, type: 'radio', checked: (size === 'Large' ? true : false) },
  //   { label: 'Small', click: handleMenuItemClick, type: 'radio', checked: (size === 'Small' ? true : false) }
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  tray.on('click', function (event, data) { 
    if(mainWindow === false) {
      createWindow();
    } else {    
      mainWindow.destroy(); mainWindow = false; 
    }
  });

};


const createWindow = () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 60,
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
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.once('dom-ready', () => {
    // Open the DevTools.

    systemPreferences.askForMediaAccess('microphone').then((isAllowed) => {
      if (isAllowed) {
        mainWindow.webContents.send('info2', { msg: 'hello from main process' });
      }
    });
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', setupApp);



// app.whenReady().then(() => {
// })

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
    setupApp();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
