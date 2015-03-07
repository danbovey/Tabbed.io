var hovering = false;
var customwallpaper;
var search;
var countdowntimer;
var lightfonts;

var date = new Date();
date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

var canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
document.body.appendChild(canvas);
var context = canvas.getContext('2d');

var count = 0;
var counter = null;
var cancelCounter = null;
var counterFlashTask = null;
var counterFlash = false;
var audio = document.getElementById('buzzer');

// @codekit-append 'popouts.js', 'addons.js', 'background.js', 'clock.js', 'search.js', 'countdown.js';