const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(key) {
      return ipcRenderer.sendSync('store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('store-set', property, val);
    },
  },
});