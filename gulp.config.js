module.exports = function () {

        var config = {

                //JavaScript - all js to vet
                alljs: [
                        'app.js',
                        'script.js'
                ],

                browserReloadDelay: 3000,

                //css file location
                css: './styles.css',

                //index.html
                index: './index.html',

                //script.js
                js: './script.js',

                //config.less
                less: './styles.less',

                //node settings
                nodeDefaultPort: 7203,
                nodeServer: './app.js',

                root: './'

        };

        return config;
};

