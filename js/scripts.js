var hovering = false;
var customwallpaper;
var search;
var countdowntimer;
var lightfonts;

var date = new Date();
date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

var count = 0;
var counter = null;
var cancelCounter = null;
var audio = document.getElementById('buzzer');

// @codekit-append 'popouts.js', 'addons.js', 'background.js', 'clock.js', 'search.js', 'countdown.js';