$(document).ready(function() {
	var change = false;
	function toggleMenu() {
		$('#menu').toggleClass('is-visible');
		$('#menu-screen').toggleClass('is-visible');
	}

	function getWallpaper(change) {
		var date = new Date();
		date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

		var imageData;

		if(change || localStorage.getItem(date) === null) {
			localStorage.clear();

			var img = new Image();
			img.crossOrigin = '';
			if(change) {
				img.src = 'https://unsplash.it/1919/1079/?random&element=body';
			} else {
				img.src = 'https://unsplash.it/1920/1080/?random&element=body';
			}

			img.onload = function() {
				var canvas = document.createElement('canvas');
				canvas.width = 1920;
				canvas.height = 1080;
				document.body.appendChild(canvas);
				var context = canvas.getContext('2d');
				context.drawImage(img, 0, 0);

				imageData = canvas.toDataURL("image/jpeg");

				localStorage.setItem(date, imageData);
				$('body').css('background-image', 'url(' + imageData + ')');
			};
		} else {
			imageData = localStorage.getItem(date);
			$('body').css('background-image', 'url(' + imageData + ')');
		}
	}
	getWallpaper();

	$('#change-wallpaper').click(function(e) {
		localStorage.clear();
		$('body').removeAttr('style');
		if(change) {
			change = false;
		} else {
			change = true;
		}
		getWallpaper(change);
		toggleMenu();
		e.preventDefault();
	});
});