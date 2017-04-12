const clock = {
    task: null,
    init: () => {
        clock.run();
        clock.task = window.setInterval(clock.run, 500);

        const reps = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
        $('.date h2').text(new Date().toLocaleDateString('en-GB', reps));
        $('.widget.date').fadeIn(1000);

        $('#btn-clock').click(function() {
            const opts = Storage.get();
            $('.widget.clock').stop(true, true).hide().fadeIn(500);
            opts.clock.military = !opts.clock.military;

            Storage.save(opts);
            clock.run();
        });
    },
    stop: () => {
        if(clock.task !== null) {
            window.clearInterval(clock.task);
            clock.task = null;
        }
    }
    run: () => {
        const options = Storage.get();
        if(counter === null) {
            const now = new Date();
            let hh = now.getHours();
            let min = now.getMinutes();

            if(options.clock.military === false) {
                hh = hh % 12;
                hh = hh ? hh : 12;
                hh = hh === 0 ? '0' + hh : hh;
            } else {
                if(hh > 12) {
                    hh = hh % 24;
                    hh = hh < 9 ? '0' + hh : hh;
                }
            }
            min = min < 10 ? '0' + min : min;

            const time = hh + ":" + min;

            $('.clock h1').text(time);
            $('.widget.clock').fadeIn(1000);
        }
    }
};

module.exports = clock;
