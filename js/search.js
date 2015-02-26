$(function() {
	$('#query').val = '';

	$('#query').keypress(function(e) {
		if(e.keyCode === 13) {
			window.location = getLocation($(this).val());
		}
	});

	function getLocation(query) {
		if(query === 'google') {
			return 'https://google.com';
		}

		if(query === 'facebook') {
			return 'https://www.facebook.com';
		}

		if(query === 'youtube') {
			return 'https://www.youtube.com';
		}

		if(query === 'yahoo') {
			return 'https://yahoo.com';
		}

		if(query === 'wiki' || query === 'wikipedia') {
			return 'http://wikipedia.org';
		}

		if(query === 'twitter') {
			return 'https://twitter.com';
		}

		if(query === 'bing') {
			return 'https://bing.com';
		}

		if(query === 'pinterest') {
			return 'https://www.pinterest.com'
		}

		if(query === 'reddit') {
			return 'https://www.reddit.com';
		}

		if(query === 'wordpress') {
			return 'https://wordpress.com';
		}

		if(query === 'instagram') {
			return 'https://instagram.com';
		}

		if(query === 'tumblr') {
			return 'https://www.tumblr.com';
		}

		if(query === 'paypal') {
			return 'https://www.paypal.com';
		}

		if(query === 'imgur') {
			return 'https://imgur.com';
		}

		if(query === 'apple') {
			return 'https://www.apple.com';
		}

		if(query === 'microsoft') {
			return 'https://www.microsoft.com';
		}

		if(query === 'imdb') {
			return 'https://www.imdb.com';
		}

		if(query === 'stack overflow') {
			return 'https://stackoverflow.com';
		}

		if(query === 'craigslist') {
			return 'http://craigslist.com';
		}

		if(query === 'netflix') {
			return 'https://www.netflix.com';
		}

		if(query === 'bbc') {
			return 'http://www.bbc.co.uk';
		}

		if(query === 'cnn') {
			return 'http://cnn.com';
		}

		if(query === 'dropbox') {
			return 'https://www.dropbox.com';
		}

		if(query === 'github') {
			return 'https://github.com';
		}

		if(query === 'gmail') {
			return 'http://mail.google.com';
		}

		if(query === 'flickr') {
			return 'https://www.flickr.com';
		}

		if(query === 'yelp') {
			return 'http://www.yelp.com';
		}

		if(query === 'godaddy') {
			return 'https://www.godaddy.com';
		}

		if(query === 'vimeo') {
			return 'https://vimeo.com';
		}

		if(query === 'etsy') {
			return 'https://www.etsy.com';
		}

		if(query === 'cnet') {
			return 'http://cnet.com';
		}

		if(query === 'slideshare') {
			return 'http://www.slideshare.com';
		}

		if(query === 'deviantart') {
			return 'http://www.deviantart.com';
		}

		if(query === 'forbes') {
			return 'http://www.forbes.com';
		}

		if(query === 'twitch') {
			return 'http://www.twitch.tv';
		}

		if(query === 'soundcloud') {
			return 'https://soundcloud.com';
		}

		if(query === 'quora') {
			return 'https://www.quora.com';
		}

		if(query === 'mailchimp') {
			return 'http://mailchimp.com';
		}

		if(query === '9gag') {
			return 'http://9gag.com';
		}

		if(query === 'lifehacker') {
			return 'http://www.lifehacker.com';
		}

		if(query === 'fiverr') {
			return 'https://www.fiverr.com';
		}

		if(query === 'gizmodo') {
			return 'http://www.gizmodo.com';
		}

		if(query === 'trello') {
			return 'https://trello.com';
		}

		if(query === 'evernote') {
			return 'https://evernote.com';
		}

		if(query === 'kickstarter') {
			return 'https://www.kickstarter.com';
		}

		if(query === 'outlook') {
			return 'https://outlook.com';
		}

		if(query === 'xe') {
			return 'http://www.xe.com';
		}

		else {
			var re = new RegExp(' ', 'g');
			query = query.replace(re, '+');
			return 'https://google.com/search?q=' + query;
		}
	}
});