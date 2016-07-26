$(function() {
	// Chrome Sync Variables

	var defaults = {
		background: {
			id: null,
			date: -1,
			author: null
		},
		customWallpaper: {
			enabled: false,
			url: ''
		},
		chromeApps: false,
		clock: {
			military: true
		},
		search: true,
		countdownTimer: {
			enabled: false,
			sound: 'analysis'
		},
		lightFonts: true
	};

	var options = defaults;
	refreshOptions();

	chrome.storage.sync.get('options', function(obj) {
		options = $.extend({}, defaults, obj.options);

		if(options.background.date == -1) {
			options.background.date = null;
		}

		$('#btn-clock').prop('checked', options.clock.military);
		$('#add-customwallpaper').prop('checked', options.customWallpaper.enabled);
		if(options.customWallpaper.enabled) {
			$('#input-customwallpaper-container').show();
		}

		// Migrate countdownTimer settings from 1.3.1 to 1.4
		if(options.countdownTimer === true || options.countdownTimer === false) {
			console.log('Migrating countdownTimer settings');
			options.countdownTimer = {
				enabled: options.countdownTimer,
				sound: 'analysis'
			};
			saveSync();
		}

		refreshOptions();
	});

	function saveSync() {
		chrome.storage.sync.set({ options: options } );
	}

	// Local Variables

	var backgroundList = {};

	var canvas = document.createElement('canvas');
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	document.body.appendChild(canvas);
	var context = canvas.getContext('2d');

	var clockTask = null;
	var count = 0;
	var counter = null;
	var cancelCounterTask = null;
	var counterFlashTask = null;
	var counterFlash = false;
	var audio = document.getElementById('buzzer');

	var hovering = false;

	function refreshOptions() {
		customWallpaper();
		getWallpaper();
		getSearch();
		getCountdown();
		getLightFonts();
		getChromeApps();
	}

	$(document).click(function() {
		popout();
	});

	$('.popout').click(function(e) {
		e.stopPropagation();
	});

	function popout(name) {
		if(name !== undefined) {
			var pop = $('#' + name);

			$('.popout').not(document.getElementById(name)).removeClass('active');

			if(pop.hasClass('active')) {
				pop.removeClass('active');
			} else {
				pop.addClass('active');
			}
		} else {
			$('.popout').removeClass('active');
		}
	}

	var mousemoveTimeout;
	$(document).mousemove(function() {
		$('.menu').addClass('active');

		clearTimeout(mousemoveTimeout);
		mousemoveTimeout = window.setTimeout(function() {
			if(!hovering && !$('.popout').hasClass('active')) {
				$('.menu').removeClass('active');
			}
		}, 1000);
	});

	// Create inline SVGs so we can change the fill colour
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

	$('#btn-settings').click(function(e) {
		popout('settings');
		e.preventDefault();
	});

	$('.settings-tab').click(function() {
		var tab = $(this).data('target');

		$('.settings-tab').removeClass('active');
		$(this).addClass('active');

		$('#settings .tab').removeClass('active');
		$('#' + tab).addClass('active');
	});

	$('#btn-about').click(function(e) {
		popout('about');
		e.preventDefault();
	});

	$('#add-customwallpaper').click(function(e) {
		options.customWallpaper.enabled = !options.customWallpaper.enabled;
		$('#input-customwallpaper-container').toggle();

		saveSync();
		customWallpaper();
	});

	function customWallpaper() {
		$('#add-customwallpaper').prop('checked', options.customWallpaper.enabled);
	}

	$('#add-search').click(function(e) {
		options.search = !options.search;
		saveSync();
		getSearch();

		e.preventDefault();
	});

	function getSearch() {
		if(options.search) {
			$('.search').fadeIn();
			$('#add-search img').attr('src', 'img/check.svg');
			$('#query').focus();
		} else {
			$('.search').fadeOut();
			$('#add-search img').attr('src', 'img/uncheck.svg');
		}
	}

	$('#add-countdowntimer').click(function(e) {
		options.countdownTimer.enabled = !options.countdownTimer.enabled;
		saveSync();
		getCountdown();

		e.preventDefault();
	});

	var testTimerTask = null;

	$('#timer-sound').change(function() {
		options.countdownTimer.sound = $(this).val();
		saveSync();

		audio.src = '/ogg/' + options.countdownTimer.sound + '.ogg';

		window.clearTimeout(cancelTimerTask);
		cancelTimerTask();
		audio.addEventListener('canplaythrough', testTimerSound);
	});

	function testTimerSound() {
		audio.loop = false;
		audio.play();

		testTimerTask = window.setTimeout(cancelTimerTask, audio.duration * 1000);
	}

	function cancelTimerTask() {
		audio.pause();
		audio.loop = true;
		audio.removeEventListener('canplaythrough', testTimerSound);
	}

	function getCountdown() {
		if(options.countdownTimer.enabled) {
			$('#btn-countdowntimer').show();
			$('#add-countdowntimer img').attr('src', 'img/check.svg');

			audio.src = '/ogg/' + options.countdownTimer.sound + '.ogg';
		} else {
			$('#btn-countdowntimer').hide();
			$('#add-countdowntimer img').attr('src', 'img/uncheck.svg');
		}
	}

	$('#add-lightfonts').click(function(e) {
		options.lightFonts = !options.lightFonts;
		saveSync();
		getLightFonts();

		e.preventDefault();
	});

	function getLightFonts() {
		if(options.lightFonts) {
			$('body').addClass('light');
			$('#add-lightfonts img').attr('src', 'img/check.svg');
		} else {
			$('body').removeClass('light');
			$('#add-lightfonts img').attr('src', 'img/uncheck.svg');
		}
	}

	function getWallpaperUrl(imageId) {
		return 'https://unsplash.it/' + $(window).width() + '/' + $(window).height() + '/?image=' + imageId + '&element=body';
	}

	function getWallpaper() {
		if(options.customWallpaper.enabled && options.customWallpaper.url !== '') {
			setWallpaper(options.customWallpaper.url);
			$('#input-customwallpaper').val(options.customWallpaper.url);
		} else {
			var imageData;

			var date = new Date();
				date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

			if(options.background.date != -1) {
				if(options.background.id === null || options.background.date === null || options.background.date != date) {
					options.background.date = date;
					saveSync();

					if(backgroundList.length > 0) {
						chooseWallpaper();
					} else {
						$.getJSON('https://unsplash.it/list', function(images) {
							backgroundList = images;
							chooseWallpaper();
						});
					}
				} else {
					setWallpaper(getWallpaperUrl(options.background.id));
				}
			}
		}
	}
	getWallpaper();

	function chooseWallpaper() {
		var image = backgroundList[Math.floor(Math.random() * backgroundList.length)];

		options.background.author = {
			name: image.author,
			url: image.author_url
		};
		options.background.id = image.id;
		saveSync();

		setWallpaper(getWallpaperUrl(image.id));
	}

	function setWallpaper(url) {
		var img = new Image();
		img.crossOrigin = '';
		img.src = url;

		var colorSum = 0;
		img.onload = function() {
			console.log(canvas.width, canvas.height);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(img, 0, 0);

			var brightnessImageData = context.getImageData(0, 0, canvas.width, canvas.height);
			var data = brightnessImageData.data;
			var r, g, b, avg;

			for(var x = 0, len = data.length; x < len; x += 4) {
				r = data[x];
				g = data[x + 1];
				b = data[x + 2];

				avg = Math.floor((r + g + b) / 3);
				colorSum += avg;
			}

			var brightness = Math.floor(colorSum / (this.width * this.height));
			
			if(brightness > 150) {
				$('body').addClass('black');
			} else {
				$('body').removeClass('black');
			}

			$('#btn-refresh').delay(1000).removeClass('rotating');

			var dataUrl = canvas.toDataURL('image/png');

			$('.bg').css('background-image', 'url(' + dataUrl + ')').addClass('active');

			window.setTimeout(function() {
				$('body').css('background-image', 'url(' + dataUrl + ')');
				updateAuthor();

				window.setTimeout(function() {
					$('.bg').removeClass('active');
				}, 1000);
			}, 1000);
		};
	}

	function updateAuthor() {
		if(options.background.author !== null) {
			$('#author').removeClass('hide');
			$('#wallpaper-author').html('<a href="' + options.background.author.url + '">' + options.background.author.name + '</a>');
		} else {
			$('#author').addClass('hide');
		}
	}

	$('#btn-refresh').click(function(e) {
		options.customWallpaper.enabled = false;
		options.background.id = null;

		$(this).addClass('rotating');

		customWallpaper();
		getWallpaper();
		e.preventDefault();
	});

	$('#btn-customwallpaper').click(function(e) {
		popout('customwallpaper');
		$('#input-customwallpaper').focus();

		e.preventDefault();
	});

	$('#input-customwallpaper').keypress(function(e) {
		if(e.keyCode == 13) {
			options.customWallpaper.url = $(this).val();
			options.background.author = null;
			$('#author').addClass('hide');

			saveSync();
			getWallpaper();
		}
	});

	function b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	$('#add-chromeapps').click(function(e) {
		options.chromeApps = !options.chromeApps;
		saveSync();
		getChromeApps();

		e.preventDefault();
	});

	function getChromeApps() {
		if(options.chromeApps) {
			$('#btn-chromeapps').show();
			$('#add-chromeapps img').attr('src', 'img/check.svg');
		} else {
			$('#btn-chromeapps').hide();
			$('#add-chromeapps img').attr('src', 'img/uncheck.svg');
		}
	}

	$('#btn-chromeapps').click(function(e) {
		chrome.tabs.update({ url: 'chrome://apps' });

		e.preventDefault();
	});

	function clock() {
		if(counter === null) {
			var now = new Date();
			var hh = now.getHours();
			var min = now.getMinutes();

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

			var time = hh + ":" + min;

			$('.clock h1').text(time);
			$('.widget.clock').fadeIn(1000);
		}
	}

	function startClock() {
		clock();
		clockTask = window.setInterval(clock, 500);
	}
	startClock();

	window.startClock = startClock;

	function stopClock() {
		if(clockTask !== null) {
			window.clearInterval(clockTask);
			clockTask = null;
		}
	}
	window.stopClock = stopClock;

	var reps = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	$('.date h2').text(new Date().toLocaleDateString('en-GB', reps));
	$('.widget.date').fadeIn(1000);

	$('#btn-clock').click(function() {
		$('.widget.clock').stop(true, true).hide().fadeIn(500);
		options.clock.military = !options.clock.military;

		saveSync();
		clock();
	});

	$('#query').val('');

	$('#query').keypress(function(e) {
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

	$(window).bind('beforeunload', function() {
		if(counter !== null) {
			return 'A countdown timer is active, are you sure you want to leave?';
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

		if(minutes > (24 * 60 * 60) || seconds > (24 * 60 * 60)) {
			$('#countdown .error').text('Cannot countdown over 24 hours').show();
		} else if(minutes < 0 || seconds < 0) {
			$('#countdown .error').text('Number must be positive').show();
		} else {
			$('#countdown .error').hide();

			window.clearTimeout(cancelCounterTask);

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
		window.clearInterval(counterFlashTask);
		startClock();
		document.title = 'Tabbed';
		counter = null;
		$('.clock h1').removeClass('flashing');
		$('#countdown-stop').removeClass('active');
		$('#btn-countdowntimer').removeClass('rotating');
		audio.pause();
	}

	function flashTitle() {
		if(counterFlash === false) {
			counterFlash = true;
			document.title = '--:--';
		} else {
			counterFlash = false;
			document.title = '00:00';
		}
	}

	function timer() {
		$('#countdown-stop').addClass('active');

		count = count - 1;

		if(count <= 0) {
			window.clearInterval(counter);
			counter = null;

			audio.currentTime = 0;
			audio.play();

			document.title = '00:00';

			stopClock();

			$('.clock h1').text('00:00').addClass('flashing');
			counterFlashTask = window.setInterval(flashTitle, 500);

			// Run the alarm sound for 10 loops
			cancelCounterTask = window.setTimeout(cancelCountdown, audio.duration * 1000 * 10);
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
