module.exports = function () {
        var config = {
		
                
                //clean folder
                clean: './*.css',
                
                //browserSync
                browserSyncFiles: [
                        'styles.css',
                        'index.html',
                        'script.js',
                        'gulp.js',
                        'gulp.config.js'
                ],
                browserReloadDelay: 3000,
                
                //JavaScript - all js to vet
                alljs: [
                        './script.js',
                        './gulpfile.js'
                ],
                
                //less
                less: 'styles.less',

                //node settings
                defaultPort: 7203,
                nodeServer: './app.js',
		
                //temp folder
                temp: './',

        };
        return config;
};
