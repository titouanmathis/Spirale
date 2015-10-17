'use strict';

/* ================================
 * Dependencies
 * ================================ */

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var browserSync  = require('browser-sync').create();
var notify       = require('gulp-notify');
var scsslint     = require('gulp-scss-lint');
var stylish      = require('gulp-scss-lint-stylish2');
var jscs         = require('gulp-jscs');
var jsStylish    = require('gulp-jscs-stylish');
var noop         = function () {};
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');



/* ================================
 * Config variables
 * ================================ */

var docRoot = './';
var assets = docRoot + 'src/';

// Sass options
var sassOptions = {
	src  : assets + 'scss/**/*.scss',
	dest : docRoot +'dist/css',
	opts : {
		outputStyle  : 'expanded',
		includePaths : ['./node_modules/sass-list-maps']
	}
};

// SCSS Lint options
var scssLintOptions = {
	src  : [assets + 'scss/**/*.scss'],
	opts : {
		config    : '.scss-lint.yml',
		maxBuffer : 10240000
	}
};

// JS Code Style options
var jscsOptions = {
	src  : [assets + 'js/*.js'],
	opts : {
		config : '.jscsrc',

	}
};

// Autoprefixer options
var autoprefixerOptions = {
	browsers : ['last 4 versions', '> 0.2%', 'Firefox ESR']
};

// Notify options
var notifyOptions = {
	sound : false
};

// Browser Sync options
var browserSyncOptions = {
	watchTask: true,
	open: false,
	proxy: 'http://lab.spirale'
};

// Watch options
var watchOptions = [
	// surveille les fichiers php pour l'intégration
	docRoot + 'index.html',
	// surveille les fichiers js
	docRoot + 'dist/js/app.js',
];



/* ================================
 * Tasks
 * ================================ */


// Sass compilation
gulp.task('sass', function () {
	notifyOptions.title   = 'Sass';
	notifyOptions.message = 'Le fichier <%= file.relative %> a été mis à jour';

	return gulp
		.src(sassOptions.src)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions.opts).on('error', notify.onError({
				message: '<%= error.message %>'
			})).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest(sassOptions.dest))
		.pipe(browserSync.stream())
		.pipe(sourcemaps.write())
		.pipe(notify(notifyOptions));
});


// SCSS Linting
gulp.task('scss-lint', function() {
	var reporter = stylish();
	scssLintOptions.opts.customReporter = reporter.issues;

	return gulp
		.src(scssLintOptions.src)
		.pipe(scsslint(scssLintOptions.opts))
		.pipe(reporter.printSummary);
});

// JS Code Style linting
gulp.task('js-lint', function () {

	return gulp.src(jscsOptions.src)
		.pipe(jscs())
		.on('error', noop)
		.pipe(jsStylish())
});


gulp.task('scripts', function() {
	// Single entry point to browserify
	gulp.src(assets +'js/app.js')
		.pipe(browserify())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('uglify', function() {
	gulp.src(assets +'js/app.js')
		.pipe(browserify())
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
});


// Watch
gulp.task('watch', ['sass'], function() {
	browserSync.init(browserSyncOptions);

	gulp.watch(sassOptions.src, ['sass']);
	gulp.watch(docRoot +'src/js/app.js', ['scripts']);
	gulp.watch(watchOptions).on('change', browserSync.reload);
});

gulp.task('default', ['watch']);