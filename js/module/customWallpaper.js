const Storage = require('../storage');

const customWallpaper = {
    init: () => {
        const options = Storage.get();
        
        $('#add-customwallpaper').click(function(e) {
            customWallpaper.toggle();
        });

        $('#add-customwallpaper').prop('checked', options.customWallpaper.enabled);
        if(options.customWallpaper.enabled) {
            $('#input-customwallpaper-container').show();
        }
    },
    toggle: () => {
        const options = Storage.get();

        options.customWallpaper.enabled = !options.customWallpaper.enabled;
        
        $('#input-customwallpaper-container').toggle();
        $('#add-customwallpaper').prop('checked', options.customWallpaper.enabled);

        Storage.save(options);
    } 
};

module.exports = customWallpaper;
