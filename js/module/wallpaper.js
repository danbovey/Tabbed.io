const Storage = require('../storage');

const customWallpaper = require('./customWallpaper');

const wallpaper = {
    backgroundList: [],
    init: () => {
        const options = Storage.get();

        $('#btn-refresh').click(e => {
            e.preventDefault();
            
            const opts = Storage.get();
            opts.customWallpaper.enabled = false;
            opts.background.id = null;

            $(this).addClass('rotating');

            customWallpaper.check();
            wallpaper.get();
        });

        if(options.customWallpaper.enabled && options.customWallpaper.url !== '') {
            wallpaper.set(options.customWallpaper.url);
            $('#input-customwallpaper').val(options.customWallpaper.url);
        } else {
            let date = new Date();
            date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            if(options.background.date != -1) {
                if(options.background.id === null || options.background.date === null || options.background.date != date) {
                    options.background.date = date;
                    Storage.save(options);

                    if(wallpaper.backgroundList.length > 0) {
                        wallpaper.choose();
                    } else {
                        $.getJSON('https://unsplash.it/list', images => {
                            wallpaper.backgroundList = images;
                            wallpaper.choose();
                        });
                    }
                } else {
                    wallpaper.set(getWallpaperUrl(options.background.id));
                }
            }
        }
    },
    choose: () => {
        const options = Storage.get();
        const image = wallpaper.backgroundList[Math.floor(Math.random() * wallpaper.backgroundList.length)];

        options.background.author = {
            name: image.author,
            url: image.author_url
        };
        options.background.id = image.id;
        Storage.save(options);

        wallpaper.set(getWallpaperUrl(image.id));
    },
    set: (url) => {
        const img = new Image();
        img.crossOrigin = '';
        img.src = url;

        let colorSum = 0;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);

            const brightnessImageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = brightnessImageData.data;
            let r, g, b, avg;

            for(let x = 0; x < data.length; x += 4) {
                r = data[x];
                g = data[x + 1];
                b = data[x + 2];

                avg = Math.floor((r + g + b) / 3);
                colorSum += avg;
            }

            const brightness = Math.floor(colorSum / (this.width * this.height));
            if(brightness > 150) {
                $('body').addClass('black');
            } else {
                $('body').removeClass('black');
            }

            $('#btn-refresh').delay(1000).removeClass('rotating');

            const dataUrl = canvas.toDataURL('image/png');

            $('.bg').css('background-image', 'url(' + dataUrl + ')').addClass('active');

            window.setTimeout(() => {
                $('body').css('background-image', 'url(' + dataUrl + ')');
                updateAuthor();

                window.setTimeout(() => {
                    $('.bg').removeClass('active');
                }, 1000);
            }, 1000);
        };
    },
    updateAuthor: () => {
        const options = Storage.get();
        if(options.background.author !== null) {
            $('#author').removeClass('hide');
            $('#wallpaper-author').html('<a href="' + options.background.author.url + '">' + options.background.author.name + '</a>');
        } else {
            $('#author').addClass('hide');
        }
    }
};

module.exports = wallpaper;
