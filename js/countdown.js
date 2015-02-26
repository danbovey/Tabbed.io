$(function() {
	$('#btn-countdowntimer').click(function(e) {
		popout('countdown');
		$('#input-countdown').focus();

		e.preventDefault();
	})

	$('#input-countdown').keypress(function(e) {
		if(e.keyCode === 13) {
			if(!isNaN($(this).val())) {
				if($(this).val() > (24 * 60 * 60)) {
					$('#countdown .error').text('Cannot countdown over 24 hours').show();
				} else if($(this).val() < 1) {
					$('#countdown .error').text('Number must be positive').show();
				} else {
					$('#countdown .error').hide();

					window.clearTimeout(cancelCounter);

					count = $(this).val();
					countdown();

					$('#btn-countdowntimer').addClass('rotating');

					popout();
				}
			}
		}
	});

	function countdown() {
		cancelCountdown();
		counter = window.setInterval(timer, 1000);
	}

	function cancelCountdown() {
		window.clearInterval(counter);
		counter = null;
		$('.clock h1').removeClass('flashing');
		$('#btn-countdowntimer').removeClass('rotating');
		audio.pause();
	}

	function timer() {
		count = count - 1;

		if(count <= 0) {
			window.clearInterval(counter);

			audio.currentTime = 0;
			audio.play();

			$('.clock h1').text('00:00').addClass('flashing');

			cancelCounter = window.setTimeout(cancelCountdown, 5700);
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
		} else {
			$('.clock h1').text(hours + ":" + minutes + ":" + seconds);
		}
	}
});