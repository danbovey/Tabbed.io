const Popout = {
    toggle: (name) => {
        if(name !== undefined) {
            Popout.open(name);
        } else {
            Popout.close(name);
        }
    },
    open: (name) => {
        const pop = $('#' + name);
        $('.popout').not(document.getElementById(name)).removeClass('active');

        if(pop.hasClass('active')) {
            pop.removeClass('active');
        } else {
            pop.addClass('active');
        }
    },
    close: (name) => {
        $('.popout').removeClass('active');
    }
};

module.exports = Popout;
