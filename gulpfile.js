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

//automate dev node server start and restart on changes
gulp.task('serve-dev', ['inject'], function () {

    serve(true /* is Dev */);

});

//automate build node server start and restart on changes
gulp.task('serve-build', ['optimize'], function () {

    serve(false /* is Dev */);

});

//wiredep and inject to manage index.html scripts and dependencies
gulp.task('inject', ['styles'], function () {
    log('***Inject the custom css into the app html and call wiredep');

    return gulp
        .src(config.html)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject', 'wiredep'], function () {

    log('***Optimizing the js, css, html');

    var assets = $.useref.assets({ searchPath: './' });

    var cssFilter = $.filter('**/*.css', { restore: true });

    return gulp
        .src(config.index)
    //error handling
        .pipe($.plumber())
        
    //combine all assets and concat into one reference
        .pipe(assets)
        
    //filter down to css
        .pipe(cssFilter)
        
    //csso filter to css
        .pipe($.csso())
        
    //revised working filter to restore css
        .pipe(cssFilter.restore)
        
    //output all files back from stream
        .pipe(assets.restore())
	
    //output to build
        .pipe(gulp.dest(config.build))
        ;

});

gulp.task('inject', ['styles'], function () {
    log('***Inject the custom css into the app html and call wiredep');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

//wiredep and inject to manage index.html scripts and dependencies
gulp.task('wiredep', function () {
	log('***Wire up the bower css js and our app js into the html');

	var options = config.getWiredepDefaultOptions();
	var wiredep = require('wiredep').stream;

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));

});

//task less-watcher run tasks styles if there are changes
gulp.task('less-watcher', ['styles'], function () {
    log('***Watching LESS files...');
    gulp.watch([config.less], ['styles']);
});
//
gulp.task('styles', ['clean-styles'], function () {
    log('***Compiling less to css...');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp))
        .pipe(gulp.dest(config.root));
});

//task clean-styles callback waits for done then runs
gulp.task('clean-styles', ['vet'], function (done) {
    clean(config.temp + '**/*.css', done);
});

gulp.task('clean', ['vet'], function () {
    log('***Cleaning files...');
    del(config.clean);
});

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

////////////////////////////////////
function serve(isDev) {
    log('***Start pre processes and node server...');

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 15,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted');
            log('files changes on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync('isDev');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });

}

//task clean dels path and returns done to callback
function clean(path, done) {
    log('***Cleaning ' + $.util.colors.blue(path));
    del(path, done);
}

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

//startBrowserSync function
function startBrowserSync(isDev) {
    //disable browserSync with --nosync arg
    if (args.nosync || browserSync.active) {
        return;
    }

    log('***Starting browserSync on port ' + port);

    if (isDev) {

        gulp.watch([config.less], ['styles'])
            .on('change', function (event) {
                changeEvent(event);
            });
    } else {

        gulp.watch([config.less, config.html, config.js], ['optimize', browserSync.reload])
            .on('change', function (event) { changeEvent(event); });

    }

    var options = {

        port: 3099,
        proxy: '10.0.0.57:' + port,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
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
