var $ = require('gulp-load-plugins')({ lazy: true }),
    args = require('yargs').argv,
    browserSync = require('browser-sync'),
    config = require('./gulp.config')(),
    del = require('del'),
    gulp = require('gulp'),
    port = process.env.PORT || config.defaultPort;

//create task listings and default task 'help'
gulp.task('help', $.taskListing);
gulp.task('default', ['serve-dev']);

gulp.task('serve-dev', ['less-watcher'], function () {

    log('***Starting web server...');

    var nodeOptions = {
        env: {
            'port': port
        },
        script: 'app.js',
        watch: [
            'index.html',
            'script.js',
            'gulpfile.js',
            'gulp.config.js',
            'app.js'
        ],
        delay: 15,
        verbose: false,
        ext: 'html js html',
        ignore: ['ignored.js,/.git/*.*'],
        tasks: ['vet']
    };

    return $.nodemon(nodeOptions)
        .on('start', function () {
            log('***Nodemon started succesfully');
            startBrowserSync();
        })
        .on('restart', ['vet'], function (ev) {
            log('***files changes on restart:\n' + ev);
            log('***Nodemon restarted!');

            setTimeout(function () {
                browserSync.notify('*** browserSync reloading now...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
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
        .pipe(gulp.dest(config.backup))
        .pipe($.csso())
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

function changeEvent(event) {
    //var srcPattern = new RegExp('/.^(?=/' + config.source + ')/');
    //log('***File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    log('***File ' + ' ' + event.type);

}

//browserSync function
function startBrowserSync() {
    //disable browserSync with --nosync arg
    if (args.nosync || browserSync.active) {
        return;
    }

    log('***Starting browserSync on port ' + port);

    gulp.watch([config.less], ['styles'])
        .on('change', function (event) {
            changeEvent(event);
        });

    var options = {

        port: 3099,
        proxy: '10.0.0.57:' + port,
        files: config.browserSyncFiles,
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
