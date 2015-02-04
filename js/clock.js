$(document).ready(function() {
	function toggleMenu() {
		$('#menu').toggleClass('is-visible');
		$('#menu-screen').toggleClass('is-visible');
	}

	if(localStorage.getItem('military') == 1) {
		military = 1;
	} else {
		military = 0;
	}

	function clock() {
		var now = new Date();
		var hh = now.getHours();
		var min = now.getMinutes();

		if(military == 0) {
			hh = hh%12;
			hh = hh?hh:12;
			hh = hh==0?'0'+hh:hh;
		} else {
			if(hh>12) {
				hh = hh%24;
				hh = hh<9?'0'+hh:hh;
			}
		}
		min = min<10?'0'+min:min;

		var time = hh + ":" + min;

		$('.clock h1').text(time);
		$('.widget.clock').fadeIn(1000);
	}
	clock();
	window.setInterval(clock, 100);

	var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	$('.date h2').text(new Date().toLocaleDateString('en-GB', options));
	$('.widget.date').fadeIn(1000);

	$('#toggle-military-time').click(function(e) {
		if(military === 0) {
			localStorage.setItem('military', 0);
			military = false;
		} else {
			localStorage.setItem('military', 1);
			military = true;
		}
		clock();
		toggleMenu();
		e.preventDefault();
	});
});