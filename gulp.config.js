module.exports = function () {
        var config = {
		
                /**
                * File paths
                */
                //all js to vet
                alljs: [
                        './script.js',
                        './gulpfile.js'
                ],
                
                //temp folder
                temp: './',
                
                //clean folder
                clean: './*.css',
                
                //less
                less: 'styles.less',
		
                //nodemon config
                nodemon: {
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
                },

        };

        return config;
};
