module.exports = function () {
        var client = './project/src/client/';
        var clientApp = client + 'app/';
        var server = './project/src/server/';
        var temp = './tmp/';
        var config = {

                //clean folder
                clean: [
                        './*.css',
                        client + 'styles/*.css',
                        './.bak/*.less'
                ],

                build: './project/build/',

                client: client,

                //css file location
                css: temp + 'styles.css',

                //backup file location
                backup: './.bak/',

                browserReloadDelay: 3000,

                //html file location
                html: clientApp + '**/*.*',

                index: client + 'index.html',

                js: [
                        //include angular modules
                        clientApp + '**/*.module.js',
                        //include other js files
                        clientApp + '**/*.js',
                        //exclude special test js files
                        '!' + clientApp + '**/*.spec.js'
                ],

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
                
                /**
		 * optimized file names
		 */
		optimized: {
			app: 'app.js',
			lib: 'lib.js'
		},
                
                //set default bower file locations
                bower: {
                        json: require('./bower.json'),
                        directory: './bower_components',
                        ignorePath: '../../'
                },

        };
        
        //provide bower locations to function
        config.getWiredepDefaultOptions = function () {
                var options = {
                        bowerJson: config.bower.json,
                        directory: config.bower.directory,
                        ignorePath: config.bower.ignorePath
                };
                return options;

        };

        return config;
};

