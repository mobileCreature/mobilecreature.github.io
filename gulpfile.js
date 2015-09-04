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

gulp.task('serve-dev', ['inject'], function () {

    log('***Starting web server...');

    var nodeOptions = {
        env: {
            'port': port
        },
        script: './src/server/app.js',
        watch: [config.watch],
        delay: 15,
        verbose: false,
        ext: 'html js',
        ignore: ['ignored.js,/.git/*.*'],
        tasks: ['inject']
    };

    return $.nodemon(nodeOptions)
        .on('start', function () {
            log('***Nodemon started succesfully');
            startBrowserSync();
        })
        .on('restart', ['inject'], function (ev) {
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

//wiredep and inject to manage index.html scripts and dependencies
gulp.task('inject', ['less-watcher'], function () {
	log('***Inject the custom css into the app html and call wiredep');

	return gulp
		.src(config.html)
		.pipe($.inject(gulp.src(config.css)))
		.pipe(gulp.dest(config.temp));
});

//task less-watcher run tasks styles if there are changes
gulp.task('less-watcher',['styles'], function () {
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
    //disable browserSync with --nosync arg
	if (args.nosync || browserSync.active) {
		return;
	}
    
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

function changeEvent(event) {
	var srcPattern = new RegExp('/.^(?=/' + config.source + ')/');
	log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);

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

//browserSync function
function startBrowserSync() {
    //disable browserSync with --nosync arg
    if (args.nosync || browserSync.active) {
        return;
    }

    log('***Starting browserSync on port ' + port);

    gulp.watch([config.watch], ['inject', browserSync.reload])
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
