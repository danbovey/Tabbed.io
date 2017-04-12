const Storage = require('../storage');

const search = {
    init: () => {
        const options = Storage.get();

        $('#add-search').click(function(e) {
            const opts = Storage.get();

            opts.search = !opts.search;
            Storage.save(opts);
            search.toggle();

            e.preventDefault();
        });

        $('#query').val('');

        $('#query').keypress(e => {
            if(e.keyCode === 13) {
                var query = $(this).val();
                var url = 'https://google.com/search?q=' + encodeURIComponent(query);

                // If the search doesn't have a space in it, let's use I'm Feeling Lucky!
                if(query.indexOf(' ') == -1) {
                    url += '&btnI=';
                }

                window.location = url;
            }
        });
    },
    toggle: () => {
        const options = Storage.get();

        if(options.search) {
            $('.search').fadeIn();
            $('#add-search img').attr('src', 'img/check.svg');
            $('#query').focus();
        } else {
            $('.search').fadeOut();
            $('#add-search img').attr('src', 'img/uncheck.svg');
        }
    }
};

module.exports = search;
