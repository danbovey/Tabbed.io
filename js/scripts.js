$(function() {
	var defaults = {
		background: {
			id: null,
			date: -1
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
		countdownTimer: false,
		lightFonts: true
	};

	var options = defaults;
	refreshOptions();

	chrome.storage.sync.get('options', function(obj) {
		options = $.extend({}, defaults, obj.options);

		if(options.background.date == -1) {
			options.background.date = null;
		}

		refreshOptions();
	});

	function saveSync() {
		chrome.storage.sync.set({ options: options } );
	}

	var backgroundList = {};

	var canvas = document.createElement('canvas');
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	document.body.appendChild(canvas);
	var context = canvas.getContext('2d');

	var count = 0;
	var counter = null;
	var cancelCounter = null;
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
		if(name != undefined) {
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

	$(document).mousemove(function() {
		$('.menu').addClass('active');

		var lastTimeMouseMoved = new Date().getTime();
		window.setTimeout(function() {
			var currentTime = new Date().getTime();
			if(!hovering && !$('.popout').hasClass('active')) {
				if(currentTime - lastTimeMouseMoved > 1000) {
					$('.menu').removeClass('active');
				}
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

	$('#btn-addons').click(function(e) {
		popout('addons');
		e.preventDefault();
	});

	$('#btn-about').click(function(e) {
		popout('about');
		e.preventDefault();
	});

	$('#add-customwallpaper').click(function(e) {
		options.customWallpaper.enabled = !options.customWallpaper.enabled;

		saveSync();
		customWallpaper();

		e.preventDefault();
	});

	function customWallpaper() {
		if(options.customWallpaper.enabled) {
			$('#btn-customwallpaper').show();
			$('#add-customwallpaper img').attr('src', 'img/check.svg');
		} else {
			$('#btn-customwallpaper').hide();
			$('#add-customwallpaper img').attr('src', 'img/uncheck.svg');
		}
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
		options.countdownTimer = !options.countdownTimer;
		saveSync();
		getCountdown();

		e.preventDefault();
	});

	function getCountdown() {
		if(options.countdownTimer) {
			$('#btn-countdowntimer').show();
			$('#add-countdowntimer img').attr('src', 'img/check.svg');
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

	function getWallpaper() {
		if(options.customWallpaper.enabled && options.customWallpaper.url != '') {
			$('body').css('background-image', 'url(' + options.customWallpaper.url + ')');
			$('#input-customwallpaper').val(options.customWallpaper.url);
		} else {
			var imageData;

			var date = new Date();
				date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

			if(options.background.date != -1) {
				if(options.background.id == null || options.background.date == null || options.background.date != date) {
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
					var img = new Image();
					var url = 'https://unsplash.it/1920/1080/?image=' + options.background.id + '&element=body';

					var xmlHTTP = new XMLHttpRequest();
					xmlHTTP.open('GET', url, true);
					xmlHTTP.responseType = 'arraybuffer';

					xmlHTTP.onload = function(e) {
						var arr = new Uint8Array(this.response);

						var raw = '';
						var i,j,subArray,chunk = 5000;
						for (i=0,j=arr.length; i<j; i+=chunk) {
							subArray = arr.subarray(i,i+chunk);
							raw += String.fromCharCode.apply(null, subArray);
						}

						var b64=btoa(raw);
						var dataUrl = 'data:image/jpeg;base64,' + b64;
						
						getBrightness(dataUrl);
					};

					xmlHTTP.send();
				}
			}
		}
	}
	getWallpaper();

	function chooseWallpaper() {
		var image = backgroundList[Math.floor(Math.random() * backgroundList.length)];
		var url = 'https://unsplash.it/' + $(window).width() + '/' + $(window).height() + '/?image=' + image.id + '&element=body';

		options.background.id = image.id;
		saveSync();

		getBrightness(url);
	}

	function getBrightness(url) {
		var img = new Image();
		img.crossOrigin = '';
		img.src = url;

		var colorSum = 0;
		img.onload = function() {
			canvas = document.getElementsByTagName('canvas')[0];
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

			$('.bg').css('background-image', 'url(' + url + ')');
			$('#btn-refresh').delay(1000).removeClass('rotating');

			window.setTimeout(function() {
				$('body').css('background-image', 'url(' + url + ')');
			}, 1000);
		}
	}

	$('#btn-refresh').click(function(e) {
		options.customWallpaper.enabled = false;
		options.background.id = null;

		$(this).addClass('rotating');

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
			saveSync();

			getWallpaper();
			popout();
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
	})

	function clock() {
		if(counter === null) {
			var now = new Date();
			var hh = now.getHours();
			var min = now.getMinutes();

			if(options.clock.military === 0) {
				hh = hh % 12;
				hh = hh ? hh : 12;
				hh = hh === 0?'0'+hh:hh;
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
	clock();
	window.setInterval(clock, 100);

	var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
	$('.date h2').text(new Date().toLocaleDateString('en-GB', options));
	$('.widget.date').fadeIn(1000);

	$('#btn-clock').click(function(e) {
		$('.widget.clock').stop(true, true).hide().fadeIn(500);
		options.clock.military = !options.clock.military;
		clock();
		e.preventDefault();
	});

	$('#query').val('');

	$('#query').keypress(function(e) {
		if(e.keyCode === 13) {
			window.location = getLocation($(this).val());
		}
	});

	function getLocation(query) {
		var sites = {
			google: 'https://google.com',
			facebook: 'https://www.facebook.com',
			youtube: 'https://www.youtube.com',
			yahoo: 'https://yahoo.com',
			wiki: 'http://wikipedia.org',
			wikipedia: 'http://wikipedia.org',
			twitter: 'https://twitter.com',
			bing: 'https://bing.com',
			pinterest: 'https://www.pinterest.com',
			reddit: 'https://www.reddit.com',
			wordpress: 'https://wordpress.com',
			instagram: 'https://instagram.com',
			tumblr: 'https://www.tumblr.com',
			paypal: 'https://www.paypal.com',
			imgur: 'https://imgur.com',
			apple: 'https://www.apple.com',
			microsoft: 'https://www.microsoft.com',
			imdb: 'https://www.imdb.com',
			stackoverflow: 'https://stackoverflow.com',
			craigslist: 'http://craigslist.com',
			netflix: 'https://www.netflix.com',
			bbc: 'http://www.bbc.co.uk',
			cnn: 'http://cnn.com',
			dropbox: 'https://www.dropbox.com',
			github: 'https://github.com',
			gmail: 'http://mail.google.com',
			flickr: 'https://www.flickr.com',
			yelp: 'http://www.yelp.com',
			godaddy: 'https://www.godaddy.com',
			vimeo: 'https://vimeo.com',
			etsy: 'https://www.etsy.com',
			cnet: 'http://cnet.com',
			slideshare: 'http://www.slideshare.com',
			deviantart: 'http://www.deviantart.com',
			forbes: 'http://www.forbes.com',
			twitch: 'http://www.twitch.tv',
			soundcloud: 'https://soundcloud.com',
			quora: 'https://www.quora.com',
			mailchimp: 'http://mailchimp.com',
			'9gag': 'http://9gag.com',
			lifehacker: 'http://www.lifehacker.com',
			fiverr: 'https://www.fiverr.com',
			gizmodo: 'http://www.gizmodo.com',
			trello: 'https://trello.com',
			evernote: 'https://evernote.com',
			kickstarter: 'https://www.kickstarter.com',
			outlook: 'https://outlook.com',
			xe: 'http://www.xe.com'
		};

		var q = query.toLowerCase();
		if(sites[q] != null) {
			return sites[q];
		} else {
			var re = new RegExp(' ', 'g');
			query = query.replace(re, '+');
			return 'https://google.com/search?q=' + query;
		}
	}

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
		window.clearInterval(counterFlashTask);
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

			$('.clock h1').text('00:00').addClass('flashing');
			counterFlashTask = window.setInterval(flashTitle, 500);

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