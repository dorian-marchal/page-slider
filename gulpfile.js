(function () {
'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var notifier = require('node-notifier');
var jasmine = require('gulp-jasmine');
var debug = require('gulp-debug');
var tinylr;

var webrootPath = '.';
var distPath = webrootPath + '/lib';
var cssPath = webrootPath + '/lib';
var jsPath = webrootPath + '/src/';
var jsWatch = jsPath + '/*.js';
var sassPath = webrootPath + '/src/scss';
var sassWatch = sassPath + '/*.scss';

var lrPort = 35729;

var lrWatchPaths = [
    distPath + '/*.css',
    distPath + '/*.js',
];

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
          files: [ fileName ]
        }
    });
}

gulp.task('default', ['live']);

gulp.task('live', ['live-compass', 'live-uglify', 'live-reload', 'live-test']);

// Live reload
gulp.task('live-reload', function () {
    tinylr = require('tiny-lr')();
    tinylr.listen(lrPort);

    for (var i in lrWatchPaths) {
        gulp.watch(lrWatchPaths[i], notifyLiveReload);
    }
});

// Compass
gulp.task('live-compass', function () {
    return gulp.watch(sassWatch, ['compass']);
});

gulp.task('compass', function () {

    return gulp.src(sassWatch)
        .pipe(plumber())
        .pipe(compass({
            config_file: sassPath + '/config.rb',
            css: cssPath,
            sass: sassPath,
        }))
        .pipe(gulp.dest(cssPath));
});

// Uglify
gulp.task('uglify', function () {
    return gulp.src(jsWatch)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename('page-slider.min.js'))
        .pipe(gulp.dest(distPath));
});

gulp.task('live-uglify', function () {
    return gulp.watch(jsWatch, ['uglify']);
});

// Jasmine
var specWatch = './test/*spec.js';
gulp.task('test', function () {

    var error = false;

    return gulp.src([specWatch, distPath + '/*.js'])
        .pipe(plumber())
        .pipe(jasmine({
            verbose: true,
        }))
        .on('error', notify.onError(function () {
            error = true;
            return {
                title: 'Jasmine Test Failed',
                message: 'One or more tests failed, see the cli for details.',
            };
        }))
        .on('end', function () {
            if (!error) {
                notifier.notify({
                    title: 'Jasmine Test Success',
                    message: 'Every tests passed :)',
                });
            }
        })
    ;
});

gulp.task('live-test', function () {
    return gulp.watch([specWatch, distPath + '/*.js'], ['test']);
});



})();
