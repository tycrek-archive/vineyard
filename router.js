var Router = require('express').Router();
var Frontend = require('./frontend.js');

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

Router.get('/js', (_req, res) => {
	let js = Frontend.js();
	respond(res, js, 'js');
});

Router.get('/css', (_req, res) => {
	let css = Frontend.css();
	respond(res, css, 'css');
});