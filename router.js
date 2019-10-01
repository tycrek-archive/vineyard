var Router = require('express').Router();
var Frontend = require('./frontend.js');
var Psql = require('./psql');

function respond(res, payload, type = 'html', status = 200) {
	res.status(status);
	res.type(type);
	res.send(payload);
}

// Check if we are sending the full DOM or a piece
Router.use((req, res, next) => {
	// CORS headers
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	next();
});

Router.get('/', (req, res) => {
	Frontend.testIndex().then((html) => respond(res, html));
});

Router.get('/js', (req, res) => {
	Frontend.js().then((js) => respond(res, js, 'js'));
});

Router.get('/css', (_req, res) => {
	Frontend.css().then((css) => respond(res, css, 'css'));
});

Router.get('/getVine/:min', (req, res) => {
	let min = req.params.min;
	Psql.getVine(min)
		.then((vine) => respond(res, vine, 'json'));
});

module.exports = Router;