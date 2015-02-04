$(document).ready(function(){
	function toggleMenu() {
		$('#menu').toggleClass('is-visible');
		$('#menu-screen').toggleClass('is-visible');
	}

	$('#menu-btn').on('click touchstart', function(e) {
		toggleMenu();
		e.preventDefault();
	});

	$('#menu-screen').on('click touchstart', function(e) {
		toggleMenu();
		e.preventDefault();
	});
});