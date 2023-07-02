const {
  shell,
  dialog,
} = require('electron');
const { compareVersions } = require("compare-versions");

const hasUpdate = async (currentVersion) => {
  const gitopiaResponse = await fetch(
    "https://api.gitopia.com/gitopia/gitopia/gitopia/Moar/repository/moar-desktop/releases/latest"
  );

  const latestVersion = (await gitopiaResponse.json()).Release.tagName.slice(1);
  if (compareVersions(currentVersion, latestVersion) >= 0) {
    throw new Error("no update");
  }

  return latestVersion;
};

const checkForUpdate = (mainWindow, currentVersion, noUpdateAction) => {
  hasUpdate(currentVersion)
    .then((newVersion) => {
      console.log(newVersion);
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

module.exports = { hasUpdate, checkForUpdate };
