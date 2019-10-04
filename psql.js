const { Pool } = require('pg');
var fs = require('fs-extra');
var Utils = require('./utils');

var pool = new Pool({
	connectionString: fs.readJsonSync(Utils.path('auth.json')).psql
});

exports.getRandomVine = (min) => {
	let q = {
		text: 'SELECT * FROM vines WHERE loops > $1 ORDER BY RANDOM() LIMIT 1;',
		values: [min]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows[0]))
			.catch((err) => reject(err));
	});
}

exports.getVine = (vineId) => {
	let q = {
		text: 'SELECT * FROM vines WHERE vineid = $1;',
		values: [vineId]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows[0]))
			.catch((err) => reject(err));
	});
}

exports.getFromTags = (tags) => {
	let q = {
		text: `
			SELECT *
			FROM vines
			WHERE $1 <@ tags
			ORDER BY loops DESC;
		`,
		values: [tags]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows))
			.catch((err) => reject(err));
	});
}

exports.getUser = (userIdStr) => {
	let q = {
		text: 'SELECT * FROM vines WHERE useridstr = $1 ORDER BY created DESC',
		values: [userIdStr]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows))
			.catch((err) => reject(err));
	});
}

exports.search = (search) => {
	let terms = `%${search.split(' ').join('%')}%`.toLowerCase();
	let tagTerms = search.toLowerCase().split(' ');
	let q = {
		text: `SELECT * FROM vines WHERE
			(LOWER(description) LIKE $1) OR
			($2 <@ tags)
			ORDER BY loops DESC
			LIMIT 100;
		`,
		values: [terms, tagTerms]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows))
			.catch((err) => reject(err));
	});
}

exports.addTags = (vineId, tags) => {
	let q = {
		text: 'UPDATE vines SET tags = ARRAY_CAT(tags, $1) WHERE vineid = $2;',
		values: [tags, vineId]
	};
	return new Promise((resolve, reject) => {
		pool.query(q)
			.then((result) => resolve(result.rows))
			.catch((err) => reject(err));
	});
}