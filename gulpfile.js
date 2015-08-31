var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({ lazy: true });

var config = require('./gulp.config')();

gulp.task('hello-world', function () {
    log('This is our first Gulp task!');
});
//
gulp.task('serve-dev', ['vet'], function (ev) {
    log('Analyzing source with JSHint and JSCS...');
    log('*** nodemon restarted');
    log('files changes on restart:\n' + ev);
    $.nodemon(config.nodemon)
        .on('restart', function () {
            console.log('\n\n\n\n');
            log('***Nodemon restarted!');
        })
        .on('crash', function () {
            log('***Nodemon crashed: script crashed for some reason');
            })
        .on('exit', function () {
            log('***Nodemon exited cleanly');
        });
});

gulp.task('vet', function () {

    return gulp
        .src([
			'./script.js',
			'./gulpfile.js'
		])
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

////////////////////////////////////
//General logging function
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
