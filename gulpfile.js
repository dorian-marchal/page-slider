(function () {
'use strict';

var gulp  = require('gulp');
var plumber = require('gulp-plumber');
var tinylr;

var webrootPath = '.';
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

    var compass = require('gulp-compass');

    gulp.src(sassWatch)
        .pipe(plumber())
        .pipe(compass({
            config_file: sassPath + '/config.rb',
            css: cssPath,
            sass: sassPath,
        }))
        .pipe(gulp.dest(cssPath));
});

})();
