const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const httpProxy = require('http-proxy');
const serve = require('electron-serve');
const equal = require('deep-equal');
const { removeHostsEntries, addHostsEntries, getEntries } = require('electron-hostile');
const { makeTray } = require('./tray');

const loadURL = serve({ directory: 'public' });
const proxy = httpProxy.createProxyServer({});

let mainWindow;

function isDev() {
  return !app.isPackaged;
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
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
    mainWindow.hide();
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  });

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

const getCID = (hostname, dapps) => {
  const dapp = dapps.find(d => d.domain === hostname);
  
  if (dapp) {
    return dapp.CID;
  }

  throw new Error('subdomain not found');
};  

// req.headers.host
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();
  makeTray(() => {
    mainWindow.show();
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  });

  const gitopiaResponse = await fetch('https://server.gitopia.com/raw/Moar/dapp-registry/main/dapps.json')
  const dapps = await gitopiaResponse.json();
  
  try {
    const { getPins, addPin } = await import('./ipfs.mjs')
    const pins = await getPins();
    dapps.forEach(async d => {
      const found = pins.includes(p => p === d.CID);
      if (!found) {
        await addPin(d.CID);
      }
    }); 
  } catch (err) {
    console.error(err)
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
    await removeHostsEntries(hostEnteriesToRemove, {
      name: 'Moar',
      // icon: '/static/img.png',
    });

    await addHostsEntries(hostEnteries, {
      name: 'Moar',
      // icon: '/static/img.png',
    });
  }

  try {
    // Helia is an ESM-only module but Electron currently only supports CJS
    // at the top level, so we have to use dynamic imports to load it
    // const node = await fetchDomain("octalma.ge")

    const server = http.createServer(async function (req, res) {
      let cid;
      try {
        cid = getCID(req.headers.host.split(':')[0], dapps);
      } catch (e) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
        return;
      }
      const fullTarget = `http://127.0.0.1:8080/ipfs/${cid}/`;
      console.log(`processing request for ${req.headers.host}: ${fullTarget}`)
      proxy.web(req, res, { target: fullTarget, followRedirects: false, prependPath: true });
    });

    server.listen(80);
  } catch (err) {
    console.error(err)
  }
})
