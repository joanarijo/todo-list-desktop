const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true , contextIsolation: false } });
   mainWindow.loadURL(`file://${__dirname}/main.html`);
   mainWindow.on('closed', () => app.quit());

   const mainMenu = Menu.buildFromTemplate(menuTemplate);
   Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true , contextIsolation: false },
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todoadd',  (event, todo) => {
    mainWindow.webContents.send('todoadd', todo);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { label: 'New Todo',
            click() { createAddWindow (); }
        },
            { label: 'Clear Todo List',
            click() { mainWindow.webContents.send('todoclear'); }
        },
            { label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
        ]
    },
    {
        label: 'Edit'
    }
];

//macOs workaround
if (process.platform === 'darwin')  {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production')  {
     menuTemplate.push({
        label: 'View',
        submenu: [
            {role: 'reload'},
            {label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }}
        ]

     });
}