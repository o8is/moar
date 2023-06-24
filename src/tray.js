const { app, Tray, Menu } = require("electron");
const path = require("path");

let { openAtLogin } = app.getLoginItemSettings();

const makeTray = (toggleWindow) => {
  const trayMenuTemplate = [
    {
      label: "Toggle Window",
      click: () => toggleWindow(),
      accelerator: 'Super+Alt+Control+M',
    },
    {
      type: "separator",
    },
    { role: "about", label: "About" },
    {
      type: "separator",
    },
    {
      label: 'Open at Login',
      type: 'checkbox',
      checked: openAtLogin,
      click: () => {
        openAtLogin = !openAtLogin;
        app.setLoginItemSettings({
          openAtLogin,
        });
      },
    },
    {
      label: "Update Dapps",
      click: () => {
        app.relaunch();
        app.exit();
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      click: () => {
        app.exit();
      },
    },
  ];

  let trayLogo = "tray.png";
  // macOS tray icon supports dark/light modes.
  if (process.platform === 'darwin') {
    trayLogo = "trayTemplate.png";
  }

  const trayIcon = new Tray(path.join(__dirname, trayLogo));
  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

  // Linux doesn't support "popUpContextMenu".
  if (process.platform === 'linux') {
    tray.setContextMenu(trayMenu)
  }

  trayIcon.on("click", toggleWindow);
  trayIcon.on("right-click", () => {
    trayIcon.popUpContextMenu(trayMenu);
  });

};

module.exports = { makeTray };
