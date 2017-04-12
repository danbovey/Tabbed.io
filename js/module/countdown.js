const Storage = require('../storage');
const Popout = require('../popout');

const countdown = {
    audio: document.getElementById('buzzer'),
    count: 0,
    counter: null,
    cancelTask: null,
    testTimerTask: null,
    counterFlashTask: null,
    counterFlash: false,
    init: () => {
        const options = Storage.get();

        // Migrate countdownTimer settings from 1.3.1 to 1.4
        if(options.countdownTimer === true || options.countdownTimer === false) {
            options.countdownTimer = {
                enabled: options.countdownTimer,
                sound: 'analysis'
            };
            Storage.save(options);
        }

        $('#add-countdowntimer').click(e => {
            const opts = Storage.get();
            opts.countdownTimer.enabled = !opts.countdownTimer.enabled;
            Storage.save(opts);
            countdown.toggle();

            e.preventDefault();
        });

        $('#timer-sound').change(() => {
            const opts = Storage.get();
            opts.countdownTimer.sound = $(this).val();
            Storage.save(opts);

            audio.src = '/ogg/' + opts.countdownTimer.sound + '.ogg';

            window.clearTimeout(countdown.cancelTimerTask);
            countdown.cancelTimerTask();
            countdown.audio.addEventListener('canplaythrough', countdown.testTimerSound);
        });

        $('#btn-countdowntimer').click(function(e) {
            e.preventDefault();

            Popout.toggle('countdown');
            $('#input-minutes').focus();
        });

        $('#countdown-stop').click(function(e) {
            e.preventDefault();

            countdown.cancel();
        });

        $('#input-minutes').keypress(function(e) {
            if(e.keyCode === 13) {
                countdown.start(e.keyCode);
            }
        });

        $('#input-seconds').keypress(function(e) {
            if(e.keyCode === 13) {
                countdown.start(e.keyCode);
            }
        });

        $(window).bind('beforeunload', function() {
            if(counter !== null) {
                return 'A countdown timer is active, are you sure you want to leave?';
            }
        });
    },
    toggle: () => {
        const options = Storage.get();
        if(options.countdownTimer.enabled) {
            $('#btn-countdowntimer').show();
            $('#add-countdowntimer img').attr('src', 'img/check.svg');

            countdown.audio.src = '/ogg/' + options.countdownTimer.sound + '.ogg';
        } else {
            $('#btn-countdowntimer').hide();
            $('#add-countdowntimer img').attr('src', 'img/uncheck.svg');
        }
    },
    start: () => {
        let minutes = $('#input-minutes').val() * 60;
        let seconds = $('#input-seconds').val();

        if(minutes.length === 0) {
            minutes = 0;
        } else if(!isNaN(minutes)) {
            minutes = +minutes;
        } else {
            return $('#countdown .error').text('Must be a number').show();
        }
        if(seconds.length === 0) {
            seconds = 0;
        } else if(!isNaN(seconds)) {
            seconds = +seconds;
        } else {
            return $('#countdown .error').text('Must be a number').show();
        }

        if(minutes > (24 * 60 * 60) || seconds > (24 * 60 * 60)) {
            $('#countdown .error').text('Cannot countdown over 24 hours').show();
        } else if(minutes < 0 || seconds < 0) {
            $('#countdown .error').text('Number must be positive').show();
        } else {
            $('#countdown .error').hide();

            window.clearTimeout(countdown.cancelTask);

            countdown.count = minutes + seconds;

            countdown.count();

            $('#btn-countdowntimer').addClass('rotating');

            Popout.close();
        }
    },
    count: () => {
        countdown.cancel();
        countdown.counter = window.setInterval(countdown.timer, 1000);
    },
    cancel: () => {
        window.clearInterval(countdown.counter);
        window.clearInterval(countdown.counterFlashTask);
        countdown.startClock();
        document.title = 'Tabbed';
        countdown.counter = null;
        $('.clock h1').removeClass('flashing');
        $('#countdown-stop').removeClass('active');
        $('#btn-countdowntimer').removeClass('rotating');
        audio.pause();
    },
    testTimerSound: () => {
        countdown.audio.loop = false;
        countdown.audio.play();

        testTimerTask = window.setTimeout(countdown.cancelTimerTask, countdown.audio.duration * 1000);
    },
    cancelTimerTask: () => {
        countdown.audio.pause();
        countdown.audio.loop = true;
        countdown.audio.removeEventListener('canplaythrough', countdown.testTimerSound);
    },
    flashTitle: () => {
        if(counter.counterFlash === false) {
            counter.counterFlash = true;
            document.title = '--:--';
        } else {
            counter.counterFlash = false;
            document.title = '00:00';
        }
    },
    timer: () => {
        $('#countdown-stop').addClass('active');

        countdown.count -= 1;

        if(countdown.count <= 0) {
            window.clearInterval(countdown.counter);
            countdown.counter = null;

            countdown.audio.currentTime = 0;
            countdown.audio.play();

            document.title = '00:00';

            countdown.stopClock();

            $('.clock h1').text('00:00').addClass('flashing');
            counterFlashTask = window.setInterval(flashTitle, 500);

            // Run the alarm sound for 10 loops
            cancelTask = window.setTimeout(cancelCountdown, audio.duration * 1000 * 10);
            return;
        }

        var hours = Math.floor(((count % 31536000) % 86400) / 3600);
        var minutes = Math.floor((((count % 31536000) % 86400) % 3600) / 60);
        var seconds = (((count % 31536000) % 86400) % 3600) % 60;
        if(hours < 10) {
            hours = '0' + hours;
        }
        if(minutes < 10) {
            minutes = '0' + minutes;
        }
        if(seconds < 10) {
            seconds = '0' + seconds;
        }

        if(hours === '00') {
            $('.clock h1').text(minutes + ":" + seconds);
            document.title = minutes + ":" + seconds;
        } else {
            $('.clock h1').text(hours + ":" + minutes + ":" + seconds);
            document.title = hours + ":" + minutes + ":" + seconds;
        }
    }
};

module.exports = countdown;
