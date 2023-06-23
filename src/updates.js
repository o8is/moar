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

module.exports = { hasUpdate };
