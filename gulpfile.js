var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
	return gulp.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
		.pipe(gulp.dest('js'))
});

gulp.task('sass', function() {
	return gulp.src('src/scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			errLogToConsole: false,
			onError: function(err) {
				return notify().write(err);
			}
		}))
		.pipe(sourcemaps.write())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('css'))
		.pipe(notify("Tabbed.io - Compiled SCSS"));
});

gulp.task('watch', ['scripts', 'sass'], function() {
	gulp.watch('src/js/*.js', ['scripts']);
	gulp.watch('src/scss/*.scss', ['sass'])
});