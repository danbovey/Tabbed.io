$(function() {
	function getWallpaper() {
		if(localStorage.getItem('customwallpaper') == 1 && localStorage.getItem('customwallpaperurl') != null && localStorage.getItem('customwallpaperurl') != '') {
			var url = localStorage.getItem('customwallpaperurl');

			$('body').css('background-image', 'url(' + url + ')');
			$('#input-customwallpaper').val(url);
		} else {
			var imageData;

			if(localStorage.getItem(date) === null) {
				for(var i = 0; i < localStorage.length; i++) {
					if(localStorage.key(i).indexOf('/') > -1) {
						localStorage.removeItem(localStorage.key(i));
					}
				}
				var img = new Image();
				img.crossOrigin = '';
				var random = Math.random() * 10000;
				img.src = 'https://unsplash.it/1920/1080/?random&element=body&version=' + random;

				var colorSum = 0;

				img.onload = function() {
					var canvas = document.createElement('canvas');
					canvas.width = 1920;
					canvas.height = 1080;
					document.body.appendChild(canvas);
					var context = canvas.getContext('2d');
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

					imageData = canvas.toDataURL("image/jpeg");

					var b64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

					localStorage.setItem(date, b64Data);

					var blob = b64toBlob(b64Data, 'image/jpeg');
					var blobUrl = URL.createObjectURL(blob);

					$('body').css('background-image', 'url(' + blobUrl + ')');
					$('#btn-refresh').delay(1000).removeClass('rotating');
				};
			} else {
				var img = new Image();
				var b64Data = localStorage.getItem(date);
				img.src = 'data:image/jpeg;base64,' + b64Data;
				var blob = b64toBlob(b64Data, 'image/jpeg');
				var blobUrl = URL.createObjectURL(blob);

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

					var brightness = Math.floor(colorSum / (this.width*this.height));
					
					if(brightness > 150) {
						$('body').addClass('black');
					} else {
						$('body').removeClass('black');
					}

					$('body').css('background-image', 'url(' + blobUrl + ')');
				};
			}
		}
	}
	getWallpaper();

	$('#btn-refresh').click(function(e) {
		localStorage.setItem('customwallpaper', 0);
		customwallpaper = 0;
		localStorage.removeItem(date);

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
			localStorage.setItem('customwallpaperurl', $(this).val());
			getWallpaper();
			popout();
		}
	});
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