const {app, BrowserWindow, nativeImage} = require('electron')
const path = require('path')
const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const HIDListen = require('@ashleymcdonald/hid-listen');
const {layers, driver} = require('./config.json')

const run_qmk_console = (mainWindow) => {
    const inst = new HIDListen();
    inst.on('connect', () => {
        console.log('Listening:');
    });
    inst.on('disconnect', () => {
        console.log('Device disconnected.');
        console.log('Waiting for new device:');
    });
    inst.on('data', (data) => {
        console.log(data);
        data.toString().trim().toLowerCase().split("\n")
            .forEach(line => mainWindow.webContents.send('layer', line.split(":")[1]))
    })
}

const run_zmk = (mainWindow) => {
    SerialPort.list()
        .then(ports => {
            const port = ports.find(port => port.manufacturer === 'ZMK Project')
            if (typeof port === 'undefined') return;
            const parser = new SerialPort({
                path: port.path, baudRate: 115200
            }).pipe(new ReadlineParser({delimiter: '\r\n'}))
            parser.on('data', data => {
                if (data.includes('zmk.set_layer_state')) {
                    const {layer, state} = data.match(/layer (?<layer>[0-9]) state (?<state>[0-9])/).groups
                    mainWindow.webContents.send('layer', layers[state == 0 ? 0 : layer])
                }
                if (data.includes('binding_pressed') || data.includes('binding_released')) {
                    const key = data.match(/position ([0-9]+)/)[1]
                    mainWindow.webContents.send('press', {pressed: data.includes('binding_pressed'), key})
                    //console.log(data.includes('binding_pressed') ? "⬇" : "⬆", key)
                }
            })
        })
}


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800, height: 300, webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }, title: "WIMFLA", icon: app.getAppPath() + "/icon.png",
        frame: false,
        transparent: true
    })
    mainWindow.loadFile('kyria.html')

    if (driver === "zmk")
        run_zmk(mainWindow); // uses debug usb info for now to window
    else
        run_qmk_console(mainWindow); // hid_listen to window

    if (process.platform === 'darwin')
        app.dock.setIcon(nativeImage.createFromPath(app.getAppPath() + "/icon.png"));
}

app.whenReady().then(createWindow)
app.on('window-all-closed', app.quit)

