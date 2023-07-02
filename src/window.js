const { app } = require('electron');

const hideWindow = (win) => {
    if (win) {
        win.hide();
        if (process.platform === 'darwin') {
            app.dock.hide();
        }
    }
}

const showWindow = (win) => {
    if (win) {
        win.center();
        win.show();
        if (process.platform === 'darwin') {
            app.dock.show();
        }
    }
}

const toggleWindow = (win) => {
    if (win.isVisible()) {
        hideWindow(win);
    } else {
        showWindow(win);
    }
}

module.exports = {
    hideWindow,
    showWindow,
    toggleWindow,
};