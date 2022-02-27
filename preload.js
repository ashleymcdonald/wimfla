const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    layer: (callback) => ipcRenderer.on('layer', callback),
    press: (callback) => ipcRenderer.on('press', callback)
})
