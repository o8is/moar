# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.0](https://gitopia.com/moar/moar-desktop/compare/v0.5.1...v0.6.0) (2023-06-24)


### Features

* Add global Cmd+Alt+Ctrl+M shortcut to toggle the window. ([af9c697](https://gitopia.com/moar/moar-desktop/commit/af9c697a709ab99675ed827b49c50935b988eccf))
* Enable keyboard navigation. ([b809947](https://gitopia.com/moar/moar-desktop/commit/b8099476171646fb5650e0fc81b1f3a72dbf84fb))
* **Linux:** Remove unsupported tray menu items. ([6fbb70c](https://gitopia.com/moar/moar-desktop/commit/6fbb70cbf5e899ec312a601c798915146f7665c9))
* Toggle window when tray is clicked. ([6e33d5b](https://gitopia.com/moar/moar-desktop/commit/6e33d5b8a98b8f28122fc127730e9ecf6887acba))


### Bug Fixes

* Don't open the context-menu on click. ([6f1d159](https://gitopia.com/moar/moar-desktop/commit/6f1d15916326808e8ee3976efe0f9b3db540d91d))
* **Linux:** Set default context menu on tray click. ([fa20ca6](https://gitopia.com/moar/moar-desktop/commit/fa20ca6cb30fd494016e54f5c91a018902511e54))
* **macOS:** Don't check IPFS status when opened at login. ([fdb5222](https://gitopia.com/moar/moar-desktop/commit/fdb5222faf0b0244aaf5e3a60cc3fbad8080e330))
* **macOS:** Notarize the build to prevent gatekeeper errors. ([1ddfa70](https://gitopia.com/moar/moar-desktop/commit/1ddfa709395175f2dee566e754f893f1186bdca7))
* **Windows:** Fix IPFS pinning by converting path to fileURL. ([d8b8854](https://gitopia.com/moar/moar-desktop/commit/d8b885404a79dad3a86621b893eff9d4d3d1d87a))

### [0.5.1](https://gitopia.com/moar/moar-desktop/compare/v0.5.0...v0.5.1) (2023-06-24)


### Bug Fixes

* **design:** Slight adjustments to the padding around dapp cards. ([84b6790](https://gitopia.com/moar/moar-desktop/commit/84b6790dccc6fef30d8e802ff470bde46ad053eb))

## [0.5.0](https://gitopia.com/moar/moar-desktop/compare/v0.4.6...v0.5.0) (2023-06-24)


### Features

* New dapp layout including dapp preview. ([6827dce](https://gitopia.com/moar/moar-desktop/commit/6827dceedac3d6e75479c28882a148cc59a63783))

### [0.4.6](https://gitopia.com/moar/moar-desktop/compare/v0.4.4...v0.4.6) (2023-06-24)


### Features

* Display message box when IPFS isn't running. ([5846249](https://gitopia.com/moar/moar-desktop/commit/58462491497442356e17f3cdb4c1ddcc106919cf)), closes [#12](https://gitopia.com/moar/moar-desktop/issues/12)


### Bug Fixes

* Load cached dapps list if Gitopia is down. ([66ea250](https://gitopia.com/moar/moar-desktop/commit/66ea250e74d517c70a83cb179ef5a52466a8f3c6))
* Log errors related to IPFS communication. ([d7eb649](https://gitopia.com/moar/moar-desktop/commit/d7eb649a8df723e055626e86ff3241d3ec595e65))

### [0.4.5](https://gitopia.com/moar/moar-desktop/compare/v0.4.4...v0.4.5) (2023-06-23)


### Bug Fixes

* Correct logic that checks for updates. ([4b170f8](https://gitopia.com/moar/moar-desktop/commit/4b170f86156da6823aa897d6565dabe1d96bcc65)), closes [#17](https://gitopia.com/moar/moar-desktop/issues/17)

### [0.4.4](https://gitopia.com/moar/moar-desktop/compare/v0.4.2...v0.4.4) (2023-06-23)


### Features

* Check for updates on startup. ([ada6e74](https://gitopia.com/moar/moar-desktop/commit/ada6e74df5f606450ce293e261b0410e151660c2)), closes [#6](https://gitopia.com/moar/moar-desktop/issues/6)


### [0.4.3](https://gitopia.com/moar/moar-desktop/compare/v0.4.2...v0.4.3) (2023-06-23)


### Bug Fixes

* App should not open as hidden. ([b5b8168](https://gitopia.com/moar/moar-desktop/commit/b5b8168376fa7064cca81451ab5122eb1dbe0cd7))

### [0.4.2](https://gitopia.com/moar/moar-desktop/compare/v0.4.1...v0.4.2) (2023-06-23)


### Features

* Add option to open Moar at login. ([34248de](https://gitopia.com/moar/moar-desktop/commit/34248ded70003cb8627ffcdf048a2b690f05d54b)), closes [#14](https://gitopia.com/moar/moar-desktop/issues/14)

### [0.4.1](https://gitopia.com/moar/moar-desktop/compare/v0.4.0...v0.4.1) (2023-06-23)


### Bug Fixes

* Correct text colors for light mode. ([3726a4c](https://gitopia.com/moar/moar-desktop/commit/3726a4c2896184063ccf34c05caf6e752a510f38))
* Disable application (file) menu. ([4d52e35](https://gitopia.com/moar/moar-desktop/commit/4d52e35904610db254a3ff82dc1edcf75a2c462c))
* Support ports other than 80 for Linux. ([99b0d33](https://gitopia.com/moar/moar-desktop/commit/99b0d33c435a63234b98108e612dcdb99b2a95bc)), closes [#15](https://gitopia.com/moar/moar-desktop/issues/15)
* Use white icon on Linux where dark mode isn't supported. ([cf02bb0](https://gitopia.com/moar/moar-desktop/commit/cf02bb0c064c8ea7f1aa73c71ff3520a552f9307))

## [0.4.0](https://gitopia.com/moar/moar-desktop/compare/v0.3.0...v0.4.0) (2023-06-23)


### BREAKING CHANGES

* Support new dapp registry format.

### Features

* Add the option to refresh dapp list. ([71f174d](https://gitopia.com/moar/moar-desktop/commit/71f174d1b2dfbb80fed4839567b57471ba94dfbd)), closes [#11](https://gitopia.com/moar/moar-desktop/issues/11)
* Cache dapp versions locally. ([d5da17f](https://gitopia.com/moar/moar-desktop/commit/d5da17fb1a5ea57a2b7cbbd7392913c563b4b588))
* Display the last time a dapp interface was updated. ([d34b1d7](https://gitopia.com/moar/moar-desktop/commit/d34b1d724f844a9b18622b96cdcfb1a83e68a552))
* Enable users to rollback to a specific UI version. ([1ca50a6](https://gitopia.com/moar/moar-desktop/commit/1ca50a64ca2025a1e9de88c0b76ddfcfb55415fd))
* Focus the window if opened a second time. ([22fef32](https://gitopia.com/moar/moar-desktop/commit/22fef32087b527a58a2ed497d4f1226001d3c9eb))
* Support new dapp registry format. ([a338e18](https://gitopia.com/moar/moar-desktop/commit/a338e187f4bfc58148a53a6549182e44bd62b71b))


### Bug Fixes

* We don't have the dapp name in this loop ([f98784d](https://gitopia.com/moar/moar-desktop/commit/f98784d5137adde4f5c16ca667ee3c933c780b1c))
