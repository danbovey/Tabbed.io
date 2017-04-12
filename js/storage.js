let options = {
    background: {
        id: null,
        date: -1,
        author: null
    },
    customWallpaper: {
        enabled: false,
        url: ''
    },
    chromeApps: false,
    clock: {
        military: true
    },
    search: true,
    countdownTimer: {
        enabled: false,
        sound: 'analysis'
    },
    lightFonts: true
};

const Storage = {
    load: () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(null, (items) => {
                Object.assign(options, items);
                resolve(options);
            });
        });
    },
    save: (opts) => {
        return new Promise((resolve) => {
            chrome.storage.sync.set(opts, () => {
                options = opts;
                resolve();
            });
        });
    },
    get: () => {
        return options;
    }
};

module.exports = Storage;
