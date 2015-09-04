module.exports = function () {

        var server = './src/server/';

        var config = {

                //clean folder
                clean: [
                        './*.css',
                        './.bak/*.less'
                ],

                //css file location
                css: './styles.css',

                //backup file location
                backup: './.bak/',

                //browserSync
                browserSyncFiles: [
                        './styles.css',
                        './index.html',
                        './script.js',
                        'app.js'

                ],
                browserReloadDelay: 3000,

                //html file location
                html: './index.html',

                //JavaScript - all js to vet
                alljs: [
                        './script.js',
                        './gulpfile.js',
                        './gulp.config.js',
                        './app.js'
                ],

                //less
                less: './styles.less',

                //node settings
                defaultPort: 7203,
                nodeServer: server + 'app.js',

                server: server,

                //temp folder
                temp: '.',

                watch: [
                        './index.html',
                        './script.js',
                        './app.js'
                ]

        };
        return config;
};
