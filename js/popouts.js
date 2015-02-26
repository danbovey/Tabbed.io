$(function() {
	$(document).click(function() {
		popout();
	});

	$('.popout').click(function(e) {
		e.stopPropagation();
	});
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