var GulpKit = require('GulpKit');

GulpKit(function(kit) {
    kit.scss({
        source: './scss/main.scss',
        output: './build/css/style.css'
    });

    kit.js({
        source: './js/scripts.js',
        output: './build/js/scripts.js'
    });

    kit.js({
        source: './js/extension.js',
        output: './build/js/extension.js'
    });

    kit.js({
        source: './node_modules/jquery/dist/jquery.min.js',
        output: './build/js/jquery.min.js',
        jshint: false,
        uglify: false,
        sourcemaps: false
    });
});