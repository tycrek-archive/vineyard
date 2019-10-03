// NPM modules
var express = require('express');
var compression = require('compression');

// Local imports
var Utils = require('./utils');
var Router = require('./router.js');

// Set up Express app
var app = express();
app.use(compression());
app.use('/', Router);

// Initialize and start the server
Utils.init()
	.then((server) => startServer(server))
	.catch((err) => console.error(err));

/**
 * Start the server
 * @param {JSON} server JSON object with server config info
 */
function startServer(server) {
	if (server.https) {
		require('https').createServer({
			key: '', // For key and cert, these values can be specific in config.json but must be passed as a data string
			cert: '',
		}, app).listen(server.port, () => console.log(`Server (HTTPS) hosted on: ${server.port}`))
	} else {
		app.listen(server.port, () => console.log(`Server hosted on: ${server.port}`));
	}
}

// Using module.exports lets us import the server
// into an existing Express app, most likely using
// the Vhost package.
module.exports = app;