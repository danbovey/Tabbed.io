$(function() {
	$('#btn-countdowntimer').click(function(e) {
		popout('countdown');
		$('#input-minutes').focus();

		e.preventDefault();
	});

	$('#countdown-stop').click(function(e) {
		cancelCountdown();

		e.preventDefault();
	});

	$('#input-minutes').keypress(function(e) {
		if(e.keyCode === 13) {
			startCountdown(e.keyCode);
		}
	});

	$('#input-seconds').keypress(function(e) {
		if(e.keyCode === 13) {
			startCountdown(e.keyCode);
		}
	});

	function startCountdown() {
		minutes = $('#input-minutes').val() * 60;
		seconds = $('#input-seconds').val();

		if(minutes.length === 0) {
			minutes = 0;
		} else if(!isNaN(minutes)) {
			minutes = +minutes;
		} else {
			$('#countdown .error').text('Must be a number').show();
			return;
		}
		if(seconds.length === 0) {
			seconds = 0;
		} else if(!isNaN(seconds)) {
			seconds = +seconds;
		} else {
			$('#countdown .error').text('Must be a number').show();
			return;
		}

		if(minutes > (24 * 60) && seconds > (24 * 60 * 60)) {
			$('#countdown .error').text('Cannot countdown over 24 hours').show();
		} else if(minutes < 0 || seconds < 0) {
			$('#countdown .error').text('Number must be positive').show();
		} else {
			$('#countdown .error').hide();

			window.clearTimeout(cancelCounter);

			count = minutes + seconds;

			countdown();

			$('#btn-countdowntimer').addClass('rotating');

			popout();
		}
	}

	function countdown() {
		cancelCountdown();
		counter = window.setInterval(timer, 1000);
	}

	function cancelCountdown() {
		window.clearInterval(counter);
		counter = null;
		$('.clock h1').removeClass('flashing');
		$('#countdown-stop').removeClass('active');
		$('#btn-countdowntimer').removeClass('rotating');
		audio.pause();
	}

	function timer() {
		$('#countdown-stop').addClass('active');

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
			document.title = minutes + ":" + seconds;
		} else {
			$('.clock h1').text(hours + ":" + minutes + ":" + seconds);
			document.title = hours + ":" + minutes + ":" + seconds;
		}
	}
});