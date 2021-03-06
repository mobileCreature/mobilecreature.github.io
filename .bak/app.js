//jshint -W106
// OpenShift sample Node application
var express = require('express');
var fs = require('fs');
// var bootstrap = require("bootstrap");

/**
 *  Define the web server application.
 */
var ServerApp = function () {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.for OpenShift or Cloud9 or localhost
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '10.0.0.57';
        self.port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 7203;
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === 'undefined') {
            self.zcache = {
                'index.html': '',

            };
        }

        //  Load local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');

    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    /* jshint -W106 */
    self.cache_get = function (key) {
        return self.zcache[key];
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === 'string') {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the main application.
     */
    self.createRoutes = function () {
        self.routes = {};

        self.routes['/asciimo'] = function (req, res) {
            var link = 'http://i.imgur.com/kmbjB.png';
            // var link2 = "http://i.imgur.com/008zXH1.jpg";
            res.send('<html><body><img src="' + link + '"></body></html>');
        };

        self.routes['/'] = function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html'));
        };

        self.routes['/index.html'] = function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html'));
        };

    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        self.createRoutes();
        // self.app = express.createServer();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     *  Setup to serve static files for sites
     */
    self.serveFiles = function () {

        self.app.use("/public", express.static(__dirname + '/public'));
        self.app.use("/", express.static(__dirname + '/'));

    };

    /**
     *  Start the server (starts up the web server application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};


/*  Web Server Application.  */


/**
 *  main():  Main code.
 */
var zapp = new ServerApp();
zapp.initialize();
zapp.serveFiles();
zapp.start();
