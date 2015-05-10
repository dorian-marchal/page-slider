(function () {
'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
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

gulp.task('live', ['live-compass', 'live-uglify', 'live-reload']);


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
    gulp.watch(sassWatch, ['compass']);
});

gulp.task('compass', function () {

    gulp.src(sassWatch)
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
        .pipe(uglify())
        .pipe(rename('page-slider.min.js'))
        .pipe(gulp.dest(distPath));
});

gulp.task('live-uglify', function () {
    gulp.watch(jsWatch, ['uglify']);
});


})();
