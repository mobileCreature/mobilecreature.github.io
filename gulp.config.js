module.exports = function () {
        var config = {
		
                
                //clean folder
                clean: './*.css',
                
                //backup file location
                backup: './bak/',
                
                //browserSync
                browserSyncFiles: [
                        'styles.css',
                        'index.html',
                        'script.js'

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
