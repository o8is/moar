const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  dialog,
  screen,
  globalShortcut,
} = require('electron');
const path = require('path');
const http = require('http');
const { pathToFileURL } = require('url');
const httpProxy = require('http-proxy');
const serve = require('electron-serve');
const equal = require('deep-equal');
const { removeHostsEntries, addHostsEntries, getEntries } = require('electron-hostile');
const Store = require('electron-store');
const { makeTray } = require('./src/tray');
const package = require('./package.json');
const { hasUpdate } = require('./src/updates');

const gotTheLock = app.requestSingleInstanceLock();

const checkForUpdate = (noUpdateAction) => {
  hasUpdate(package.version)
    .then((newVersion) => {
      dialog.showMessageBox(
        mainWindow,
        {
          message: `New version of Moar (v${newVersion}) available!`,
          buttons: ["Open Moar Download", "Ignore"],
          defaultId: 0,
          cancelId: 1,
        })
        .then(result => {
          if (result.response === 0) {
            shell.openExternal('https://gitopia.com/Moar/moar-desktop/releases');
          }
        });
    })
    .catch(() => {
      if (noUpdateAction) {
        noUpdateAction();
      }
    });
};

// Check for update on startup.
checkForUpdate();

const loadURL = serve({ directory: 'public' });
const proxy = httpProxy.createProxyServer({});

let dapps = [];

// Setup default store values.
const store = new Store({
  installed: {},
  dapps: [],
});

// Default to latest version.
store.set('installed', {});

// Listen to renderer events.
ipcMain.on('store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('store-set', async (_, key, val) => {
  store.set(key, val);
});

let mainWindow;

function isDev() {
  return !app.isPackaged;
}

// Turn off file menu.
Menu.setApplicationMenu(null);

let httpPort = 80;

const hideWindow = (win) => {
  if (win) {
    win.hide();
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  }
}

const showWindow = (win) => {
  if (win) {
    win.center();
    win.show();
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  }
}

const toggleWindow = (win) => {
  if (win.isVisible()) {
    hideWindow(win);
  } else {
    showWindow(win);
  }
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreenable: false,
    width: 850,
    title: 'Moar',
    backgroundColor: '#121826',
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    vibrancy: 'dark',
    skipTaskbar: true,
    height: 600,
    minWidth: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js')
    },
    show: false,
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:8888');
  } else {
    loadURL(mainWindow);
  }

  // when the window is closed.
  mainWindow.on('close', function (e) {
    e.preventDefault();
    hideWindow(mainWindow);
  });

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once('ready-to-show', () => {
    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Set the Window size dynamically.
    mainWindow.setSize(width - 100, height - 100);
    // mainWindow.maximize();
    showWindow(mainWindow);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Reset state and remount our components.
    mainWindow.reload();
    hideWindow(mainWindow);
    if (httpPort === 80) {
      shell.openExternal(url);
    } else {
      // Make sure to remove trailing slash before port.
      shell.openExternal(`${url.replace(/\/$/, "")}:${httpPort}`);
    }
    return { action: 'deny' };
  });
}

const getDapp = (hostname, dapps) => {
  const dapp = dapps.find(d => d.domain === hostname);

  if (dapp) {
    return dapp;
  }

  throw new Error('subdomain not found');
};

const getCIDs = (dapp) => Object.keys(dapp.versions).map(d => dapp.versions[d].cid);

const getCID = (dapp, version) => {
  let versionToLookup = version;
  if (typeof versionToLookup === 'undefined') {
    const versions = Object.keys(dapp.versions);
    const latestRelease = Math.max(...versions);
    versionToLookup = latestRelease;
  }

  if (typeof dapp.versions[versionToLookup] === 'undefined') {
    throw new Error('version of interface not found.');
  }

  return dapp.versions[versionToLookup].cid;
};

// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  if (!gotTheLock) {
    console.log('app already open, quitting')
    return app.quit();
  }

  app.on('second-instance', () => {
    // Tried to run a second instance, we should focus our window.
    showWindow(mainWindow);
  });

  globalShortcut.register('Super+Alt+Control+M', () => {
    toggleWindow(mainWindow);
  })

  // Similar to the second-instance event. 
  app.on('activate', () => {
    showWindow(mainWindow);
  });

  createWindow();
  makeTray(() => {
    toggleWindow(mainWindow);
  }, () => {
    checkForUpdate(() => {
      dialog.showMessageBox(
        mainWindow,
        {
          message: "You are running the latest version of Moar!",
          buttons: ["OK"],
          defaultId: 0,
        })
    })
  });

  try {
    const gitopiaResponse = await fetch('https://server.gitopia.com/raw/Moar/dapp-registry/main/dapps2.json')
    dapps = await gitopiaResponse.json();
    store.set('dapps', dapps);
  } catch (e) {
    dapps = store.get('dapps');
  }

  // TODO: Pinning every version of the UI forever is probably not the best idea.
  const cids = dapps.map(d => getCIDs(d)).flat();

  // Cache preview hashes locally.
  dapps.forEach((d) => {
    cids.push(d.preview);
  });
  try {
    const { getPins, addPin } = await import(
      // https://github.com/electron/electron/issues/6262#issuecomment-229043051
      pathToFileURL(path.join(__dirname, 'src', 'ipfs.mjs')),
    );
    // TODO: Unpin any previous interface versions.
    const pins = await getPins();
    cids.forEach(async cid => {
      const found = pins.includes(cid);
      if (!found) {
        console.log(`pinning ${cid}`);
        await addPin(cid);
      }
    });
  } catch (err) {
    console.error(err);

    // IPFS and Moar can launch at different times.
    const { wasOpenedAtLogin } = app.getLoginItemSettings();
    if (!wasOpenedAtLogin) {
      dialog.showMessageBox(
        mainWindow,
        {
          message: "IPFS is not running, start IPFS then relaunch Moar.",
          buttons: ["Open IPFS Download", "Quit"],
          defaultId: 0,
          cancelId: 1,
        })
        .then(result => {
          if (result.response === 0) {
            shell.openExternal('https://docs.ipfs.tech/install/ipfs-desktop/#install-instructions');
          }
          app.exit();
        });
    }
  }

  const domains = dapps.map(d => d.domain);
  const hostEnteries = dapps.map((d) => ({ ip: '127.0.0.1', host: d.domain }));

  const enteries = await getEntries();

  // Make sure we remove any domains that don't exist in the registry anymore.
  const hostEnteriesToRemove = enteries.map(e => {
    if (e[1].includes('moar.local')) {
      return { ip: '127.0.0.1', host: e[1] }
    }
  }).filter(i => i);

  let needsUpdate = false;
  for (domain of domains) {
    let found = false;
    for (entry of enteries) {
      if (entry[1] === domain) {
        found = true;
      }
    }

    if (!found) {
      needsUpdate = true;
    }
  }

  if (!equal(hostEnteriesToRemove, hostEnteries)) {
    needsUpdate = true;
  }

  if (needsUpdate) {
    /**
     * TODO: This should be smarter, diff current list and
     * only make deletions or additions as needed.
     */
    await removeHostsEntries(hostEnteriesToRemove, {
      name: 'Moar',
      icon: path.join(__dirname, 'logo.icns'),
    });

    await addHostsEntries(hostEnteries, {
      name: 'Moar',
      icon: path.join(__dirname, 'logo.icns'),
    });
  }

  try {
    // Web server logic, handles mapping of domains to IPFS buckets. 
    const server = http.createServer(async function (req, res) {
      let cid, features;
      try {
        const dapp = getDapp(req.headers.host.split(':')[0], dapps);
        features = dapp.features;
        const installed = store.get('installed');
        if (typeof installed[dapp.domain] === 'undefined') {
          // No preferred version found so load the latest.
          cid = getCID(dapp);
        } else {
          cid = installed[dapp.domain];
        }

      } catch (e) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        return;
      }

      // Support single apps (SPAs) if spa is included in the features section.
      const parsedPath = path.parse(req.url);
      if (
        // Check to see if dapp has SPA enabled.
        (typeof features !== 'undefined' && features.includes('spa'))
        // Check request for a sub-page.
        && req.url !== "/"
        // Make sure requested path is HTML or empty.
        // We don't want to redirect requests for JavaScript or CSS to the root.
        // TODO: We should probably try the path first like nginx try_files.
        && ['html', ''].includes(parsedPath.ext)
      ) {
        // Redirect to the base path.
        req.url = "/"
      }

      const fullTarget = `http://127.0.0.1:8080/ipfs/${cid}/`;
      console.log(`processing request for ${req.headers.host}: ${fullTarget}`)
      proxy.web(req, res, { target: fullTarget, followRedirects: false, prependPath: true });
    });

    if (process.platform === 'linux') {
      httpPort = 8008;
      server.listen(8008);
    } else {
      server.listen(80);
    }
  } catch (err) {
    console.error(err)
  }
})
