module.exports = function () {
        var client = './project/src/client/';
        var clientApp = client + 'app/';
        var server = './project/src/server/';
        var temp = './.tmp/';
        var config = {

                //clean folder
                clean: [
                        './*.css',
                        client + 'styles/*.css',
                        './.bak/*.less'
                ],
                
                client: client,

                //css file location
                css: temp + 'styles.css',

                //backup file location
                backup: './.bak/',

                browserReloadDelay: 3000,

                //html file location
                html: clientApp + '**/*.*',

                //JavaScript - all js to vet
                alljs: [
                        client + 'script.js',
                        server + 'app.js'
                ],

                //less
                less: client + 'styles/styles.less',

                //node settings
                defaultPort: 7203,
                nodeServer: server + 'app.js',

                root: './',

                server: server,

                //temp folder
                temp: temp,

                watch: [
                        client + 'index.html',
                        client + 'script.js',
                        server + 'app.js'
                ]

        };
        return config;
};
