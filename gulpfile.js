var gulp = require('gulp');
var args = require('yargs').argv;
var $loader = require('gulp-load-plugins')({ lazy: true });

gulp.task('hello-world', function () {
    log('This is our first Gulp task!');
});

gulp.task('serve-dev', ['vet'], function (ev) {
    log('Analyzing source with JSHint and JSCS...');
    log('*** nodemon restarted');
    log('files changes on restart:\n' + ev);
	$loader.nodemon({ script: 'app.js',
          ext: 'html js',
          ignore: ['ignored.js'],
          tasks: ['vet'] })
        .on('restart', function () {
            log('restarted!');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
            .on('exit', function () {
			log('*** nodemon exited cleanly');
        });
});

gulp.task('vet', function () {

    return gulp
        .src([
			'./script.js',
			'./gulpfile.js'
		])
        .pipe($loader.if(args.verbose, $loader.print()))
        .pipe($loader.jscs())
        .pipe($loader.jshint())
        .pipe($loader.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($loader.jshint.reporter('fail'));
});

////////////////////////////////////
//General logging function
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $loader.util.log($loader.util.colors.blue(msg[item]));
            }
        }
    } else {
        $loader.util.log($loader.util.colors.blue(msg));
    }
}
