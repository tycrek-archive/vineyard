var express = require('express');
var compression = require('compression');

var Utils = require('./utils');
var Router = require('./router.js');

var app = express();

app.use(compression());
app.use('/', Router);

Utils.init()
	.then((server) => {
		if (server.https) {
			require('https').createServer({
				key: '', // For key and cert, these values can be specific in config.json but must be passed as a data string
				cert: '',
			}, app).listen(server.port, () => console.log(`Server (HTTPS) hosted on: ${server.port}`))
		} else {
			app.listen(server.port, () => console.log(`Server hosted on: ${server.port}`));
		}
	})
	.catch((err) => console.error(err));

module.exports = app;