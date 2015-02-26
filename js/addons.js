$(function() {
	$(document).mousemove(function() {
		$('.menu').addClass('active');

		lastTimeMouseMoved = new Date().getTime();
		var t = setTimeout(function() {
			var currentTime = new Date().getTime();
			if(!hovering && !$('.popout').hasClass('active')) {
				if(currentTime - lastTimeMouseMoved > 1000) {
					$('.menu').removeClass('active');
				}
			}
	   }, 1000);
	});

	$('.icon img').each(function() {
		var $img = $(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		$.get(imgURL, function(data) {
			var $svg = $(data).find('svg');

			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass + ' replaced-svg');
			}
			$svg = $svg.removeAttr('xmlns:a');
			$img.replaceWith($svg);
		}, 'xml');
	});

	$('.icon').hover(function() {
	    hovering = true;
	}, function() {
	    hovering = false;
	});

	$('.icon').click(function(e) {
		e.stopPropagation();
	});

	$('#btn-addons').click(function(e) {
		popout('addons');
		e.preventDefault();
	});

	$('#btn-about').click(function(e) {
		popout('about');
		e.preventDefault();
	});

	$('#add-customwallpaper').click(function(e) {
		if(customwallpaper === 0) {
			localStorage.setItem('customwallpaper', 1);
		} else {
			localStorage.setItem('customwallpaper', 0);
		}

		customWallpaper();

		e.preventDefault();
	});

	function customWallpaper() {
		if(localStorage.getItem('customwallpaper') == 1) {
			customwallpaper = 1;

			$('#btn-customwallpaper').show();
			$('#add-customwallpaper img').attr('src', 'img/check.svg');
		} else {
			customwallpaper = 0;

			$('#btn-customwallpaper').hide();
			$('#add-customwallpaper img').attr('src', 'img/uncheck.svg');
		}
	}
	customWallpaper();

	$('#add-search').click(function(e) {
		if(search === 0) {
			localStorage.setItem('search', 1);
		} else {
			localStorage.setItem('search', 0);
		}

		getSearch();

		e.preventDefault();
	});

	function getSearch() {
		if(localStorage.getItem('search') == 1) {
			search = 1;

			$('.search').fadeIn();
			$('#add-search img').attr('src', 'img/check.svg');
			$('#query').focus();
		} else {
			search = 0;

			$('.search').fadeOut();
			$('#add-search img').attr('src', 'img/uncheck.svg');
		}
	}
	getSearch();

	$('#add-countdowntimer').click(function(e) {
		if(countdowntimer === 0) {
			localStorage.setItem('countdowntimer', 1);
		} else {
			localStorage.setItem('countdowntimer', 0);
		}

		getCountdown();

		e.preventDefault();
	});

	function getCountdown() {
		if(localStorage.getItem('countdowntimer') == 1) {
			countdowntimer = 1;

			$('#btn-countdowntimer').show();
			$('#add-countdowntimer img').attr('src', 'img/check.svg');
		} else {
			countdowntimer = 0;

			$('#btn-countdowntimer').hide();
			$('#add-countdowntimer img').attr('src', 'img/uncheck.svg');
		}
	}
	getCountdown();

	$('#add-lightfonts').click(function(e) {
		if(lightfonts === 0) {
			localStorage.setItem('lightfonts', 1);
		} else {
			localStorage.setItem('lightfonts', 0);
		}

		getLightFonts();

		e.preventDefault();
	});

	function getLightFonts() {
		if(localStorage.getItem('lightfonts') == 1) {
			lightfonts = 1;

			$('body').addClass('light');
			$('#add-lightfonts img').attr('src', 'img/check.svg');
		} else {
			lightfonts = 0;

			$('body').removeClass('light');
			$('#add-lightfonts img').attr('src', 'img/uncheck.svg');
		}
	}
	getLightFonts();
});