var $ = require('gulp-load-plugins')({ lazy: true }),
    args = require('yargs').argv,
    browserSync = ('browser-sync'),
    config = require('./gulp.config')(),
    del = require('del'),
    gulp = require('gulp');

gulp.task('serve-dev', ['less-watcher'], function () {
    log('***Starting web server...');

    return $.nodemon(config.nodemon)
        .on('start', function () {
            log('***Nodemon started succesfully');
        })
        .on('restart', ['vet'], function (ev) {
            log('***files changes on restart:\n' + ev);
            log('***Nodemon restarted!');
        })
        .on('crash', function () {
            log('***Nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('***Nodemon exited cleanly');
        });
});

//task less-watcher run tasks styles if there are changes
gulp.task('less-watcher', ['styles'], function () {
    log('***Watching LESS files...');
    gulp.watch([config.less], ['styles']);
});
//
gulp.task('styles', ['clean'], function () {
    log('***Compiling less to css...');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean', function () {
    log('***Cleaning files...');
    del(config.clean);
});

gulp.task('vet', function () {
    log('***Analyzing js with jshint and jscs..');
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
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
