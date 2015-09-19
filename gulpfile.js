var $ = require('gulp-load-plugins')({ lazy: true }),
    args = require('yargs').argv,
    browserSync = require('browser-sync'),
    config = require('./gulp.config')(),
    del = require('del'),
    gulp = require('gulp'),
    port = process.env.PORT || config.nodeDefaultPort;

/*
 * SERVE-DEV
 *
 * calls serve() with parameter true
 * for development workflow
 *
 */
gulp.task('serve-dev', ['css-prep'], function () {
    serve();
});

/*
* CSS-PREP
*
* compile less to css with gulp-less and
* autoprefix css with gulp-autoprefixer
*
*/
gulp.task('css-prep', ['clean-dev'], function () {
    log('***Compiling less to css...');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.root));
});

/*
 * CLEAN-DEV
 *
 * call CLEAN with file dev blob path
 *
 */
gulp.task('clean-dev', ['vet'], function (done) {
    clean([config.css], done);
});

/*
 * VET
 *
 * test js with gulp-jscs and gulp-jshint
 *
 */
gulp.task('vet', function () {
    log('***Analyzing js with jshint and jscs..');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

/*
 * HELP
 *
 * gulp task enumerating tasks using gulp-tasklisting
 *
 */
gulp.task('help', $.taskListing);

/*
 * DEFAULT
 *
 * gulp task assigned to default task
 *
 */
gulp.task('default', ['serve-dev']);


//////////////////////////////////////

/*
 * CLEAN
 *
 * delete files in path and return done
 *
 */
function clean(path, done) {
    log('***Cleaning ' + $.util.colors.blue(path));
    del(path, done);
}

/*
 * SERVE
 *
 * start node sever via nodemon with nodemOptions
 *
 */
function serve() {
    log('***Start pre processes and node server...');

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 15,
        env: {
            'PORT': port,
            'NODE_ENV': 'dev'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted...');
            log('files changes on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('***reloading now...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited normally...');
        });
}

/*
 * LOG
 *
 * log output with gulp-util
 *
 */
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

/*
 * CHANGEEVENT
 *
 * log output with gulp-util
 *
 */
function changeEvent(event) {
    log('***File ' + ' ' + event.type);
}

/*
 * STARTBROWSERSYNC
 *
 * start browsersync server
 *
 */
function startBrowserSync() {
    //disable browserSync with --nosync arg
    if (args.nosync || browserSync.active) {
        return;
    }

    log('***Starting browserSync on port ' + port);

    gulp.watch(config.less, ['css-prep', browserSync.stream])
        .on('change', function (event) {
            changeEvent(event);
        });

    gulp.watch(config.js, ['vet', browserSync.reload])
        .on('change', function (event) {
            changeEvent(event);
        });

    gulp.watch(config.index, browserSync.reload)
        .on('change', function (event) {
            changeEvent(event);
        });

    var options = {

        port: 3099,
        proxy: '10.0.0.57:' + port,
        files: [
            config.js,
            config.index,
            config.css
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: '*** browserSync',
        notify: true,
        reloadDelay: 3000,
        open: false,
        scrollRestoreTechnique: 'cookie',
        scrollProportionally: 'true'
    };

    browserSync(options);
}
