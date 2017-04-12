const Storage = require('./storage');

const customWallpaper = require('./module/customWallpaper');
const wallpaper = require('./module/wallpaper');
const search = require('./module/search');
const countdown = require('./module/countdown');
const lightFonts = require('./module/lightFonts');
const chromeApps = require('./module/chromeApps');

$(function() {
    Storage.load(options => {
        init();
    });

    const init = () => {
        customWallpaper.init();
        wallpaper.init();
        search.init();
        countdown.init();
        clock.init();
        lightFonts.init();
        chromeApps.init();
    };
});
