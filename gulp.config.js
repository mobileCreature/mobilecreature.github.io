module.exports = function () {
        var config = {
		
                //all js to vet
                alljs: [
                        './script.js',
                        './gulpfile.js'
                ],
		
                //nodemon config
                nodemon: {
                        script: 'app.js',
                        watch: [
                                'index.html',
                                'script.js',
                                'gulpfile.js',
                                'gulp.config.js',
                                'app.js',
                                'styles.css'
                        ],
                        delay: 10,
                        verbose: false,
                        ext: 'html js css',
                        ignore: ['ignored.js,/.git/*.*'],
                        tasks: ['vet']
                },
		
                /**
                * browser sync
                */
                browserReloadDelay: 5000
        };

        return config;
};