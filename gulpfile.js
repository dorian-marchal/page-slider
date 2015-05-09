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
var sassPath = webrootPath + '/src/scss';
var sassWatch = sassPath + '/*.scss';

var lrPort = 35729;

var lrWatchPaths = [
    cssPath + '/*.css',
    jsPath + '/*.js',
];

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr.changed({
        body: {
          files: [ fileName ]
        }
    });
}

gulp.task('live', ['livecompass', 'livereload']);

gulp.task('livereload', function () {
    tinylr = require('tiny-lr')();
    tinylr.listen(lrPort);

    for (var i in lrWatchPaths) {
        gulp.watch(lrWatchPaths[i], notifyLiveReload);
    }
});

gulp.task('livecompass', function () {
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

gulp.task('uglify', function () {
    return gulp.src(jsPath + '/*.js')
        .pipe(uglify())
        .pipe(rename('page-slider.min.js'))
        .pipe(gulp.dest(distPath));
});

})();
