const { Pool } = require('pg');
var fs = require('fs-extra');

var pool = new Pool({
	connectionString: fs.readJsonSync('auth.json').psql
});

exports.getVine = (min) => {
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