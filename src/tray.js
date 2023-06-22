const { app, Tray, Menu } = require('electron');
const path = require('path')

const makeTray = (openWindow) => {
   const trayMenuTemplate = [
      {
         label: 'Open',
         click: () => openWindow(),

      },
      {
         type: 'separator',
      },
      {
         label: 'Quit',
         click: () => {
            app.exit();
         },
      }
   ];

   const trayIcon = new Tray(path.join(__dirname, 'trayTemplate.png'));
   const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
   trayIcon.setContextMenu(trayMenu);

   trayIcon.on('click', openWindow);
};

module.exports = { makeTray };