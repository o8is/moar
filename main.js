// Modules to control application life and `create` native browser window
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const httpProxy = require('http-proxy');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });
const proxy = httpProxy.createProxyServer({})

let mainWindow;

function isDev() {
  return !app.isPackaged;
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:8888');
  } else {
    loadURL(mainWindow);
  }

  // when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });
}


// TODO: Move to DAO.
const subDomains = {
  jax: 'QmSnFh2Ad1GnScnUkTLDd8s1UTSwiE1giSEY3j3Ryr1KLv',
  octalmage: 'QmNUJoP71kUVjyCDpndmJkn7FkHMittn5BfJekguKxwj6s',
};

const getCID = (hostname) => {
  const sub = hostname.split('.')[0]
  if (typeof subDomains[sub] !== 'undefined') {
    return subDomains[sub];
  }

  throw new Error('subdomain not found');
};

// req.headers.host
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow()

  try {
    // Helia is an ESM-only module but Electron currently only supports CJS
    // at the top level, so we have to use dynamic imports to load it
    // const node = await fetchDomain("octalma.ge")

    const server = http.createServer(async function (req, res) {
      let cid;
      try {
        cid = getCID(req.headers.host);
      } catch (e) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        return;
      }

      const fullTarget = `http://127.0.0.1:8080/ipfs/${cid}/`;
      proxy.web(req, res, { target: fullTarget, followRedirects: false, prependPath: true });
    });

    console.log("listening on port 8000")
    server.listen(80);

    // shell.openExternal(node);

  } catch (err) {
    console.error(err)
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
