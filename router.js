var Router = require('express').Router();
var Frontend = require('./frontend.js');
var Psql = require('./psql');

function respond(res, payload, type = 'html', status = 200) {
	res.status(status);
	res.type(type);
	res.send(payload);
}

// Set CORS headers for fetch() API
Router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Root index
Router.get('/', (_req, res) => {
	Frontend.testIndex().then((html) => respond(res, html));
});

// Client-side JavaScript compiled by Browserify
Router.get('/js', (_req, res) => {
	Frontend.js().then((js) => respond(res, js, 'js'));
});

// SASS -> CSS compiled by node-sass
Router.get('/css', (_req, res) => {
	Frontend.css().then((css) => respond(res, css, 'css'));
});

// Return a random Vine with at least min loops
Router.get('/getRandomVine/:min', (req, res) => {
	let min = req.params.min;
	Psql.getRandomVine(min)
		.then((vine) => respond(res, vine, 'json'));
});

// Return a Vine with vineId
Router.get('/getVine/:vineId', (req, res) => {
	let vineId = req.params.vineId;
	Psql.getVine(vineId)
		.then((vine) => respond(res, vine, 'json'));
});

Router.get('/v/*', (req, res) => {
	Frontend.testIndex().then((html) => respond(res, html));
});

module.exports = Router;