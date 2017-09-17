const electron = require('electron')
// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Dialog = electron.dialog
const Menu = electron.Menu
const Tray = electron.Tray

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.showExitPrompt = true

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 960, height: 720, show: true, autoHideMenuBar: true, frame: true, webPreferences: { nodeIntegration: false, zoomFactor: 0.9 }});

  // and load the index.html of the app.
  mainWindow.loadURL(`https://www.icloud.com`);

  mainWindow.on('close', function (e) {
    if(app.showExitPrompt)
    {
      // Stop the close event
      e.preventDefault();

      // Show a dialog to ask for hide or quit
      Dialog.showMessageBox({
        type: "question",
        buttons: ["Hide", "Quit", "Cancel"],
        defaultId: 1,
        title: "Hide or Quit?",
        message: "Do you want to quit or just hide?",
        cancelId: 2
      }, function (response, checkboxChecked) {
        switch (response) {
          // Hide
          case 0:
            closeWindow();
            break;

          // Quit
          case 1:
            quitApplication();
            break;

          // Cancel
          default:
            break;
        }
      });
    }
    
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

function setupTray() {
  tray = new Tray("icon/iCloud_32.png");

  const contextMenu = Menu.buildFromTemplate([
    {click: toggleShow, label: 'Hide/Show', type: 'normal'},
    { type: 'separator'},
    {click: quitApplication, label: 'Quit', type: 'normal'}
  ]);

  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', function (e, bounds) {
    toggleShow();
  })
}

function toggleShow() {
  if(app.showExitPrompt)
    {
      closeWindow();
    }else{
      showWindow();
    }
}

function showWindow() {
  mainWindow.show();
  app.showExitPrompt = true;
}

function closeWindow() {
  app.showExitPrompt = false;
  if(mainWindow != null) {
    mainWindow.hide();
  }
}

function quitApplication() {
  closeWindow();
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  setupTray();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  //if (process.platform !== 'darwin') {
  //  app.quit()
  //}
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
