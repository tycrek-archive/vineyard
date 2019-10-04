var Router = require('express').Router();
var Frontend = require('./frontend.js');
var Psql = require('./psql');
var Utils = require('./utils');

/**
 * Sends an Express.js Response to a client
 * @param {*} res Express.js Response object
 * @param {String|JSON} payload Data to send to client
 * @param {String} type HTTP response type
 * @param {Number} status HTTP response status code
 */
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

// Client-side JavaScript compiled by Browserify
Router.get('/js', (_req, res) => {
	Frontend.js()
		.then((js) => respond(res, js, 'js'));
});

// SASS -> CSS compiled by node-sass
Router.get('/css', (_req, res) => {
	Frontend.css()
		.then((css) => respond(res, css, 'css'));
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

// Return a users vines
Router.get('/getUser/:userIdStr', (req, res) => {
	let userIdStr = req.params.userIdStr;
	Psql.getUser(userIdStr)
		.then((vines) => respond(res, vines, 'json'));
});

// Search terms
Router.get('/search/:terms', (req, res) => {
	let terms = Utils.b642str(req.params.terms);
	Psql.search(terms)
		.then((vines) => respond(res, vines, 'json'));
});

Router.get('/submitTags/:vineId/:tags', (req, res) => {
	let vineId = req.params.vineId;
	let tags = Utils.b642str(req.params.tags).split(',');
	Psql.addTags(vineId, tags)
		.then(() => respond(res, ''));
});

// Root index
Router.get('/', (_req, res) => {
	Frontend.dom('index')
		.then((index) => respond(res, index));
});

Router.get(['/v/*', '/u/*', '/s(/*)?'], (req, res) => {
	let page = req.url.split('/')[1];
	Frontend.dom(page)
		.then((dom) => respond(res, dom));
});

module.exports = Router;