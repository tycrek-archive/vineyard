var fs = require('fs-extra');
var Browserify = require('browserify');
var sass = require('node-sass');

var Utils = require('./utils');

var browserify = Browserify();

exports.js = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(Utils.path('/client/js/'))
			.then((files) => {
				files.forEach((file) => {
					let filepath = Utils.path(`/client/js/${file}`);
					browserify.add(filepath);
				});
			})
			.then(() => {
				browserify.bundle((err, buf) => {
					if (err) reject(err);
					else resolve(buf.toString());
				});
			})
			.catch((err) => reject(err));
	});
}

exports.css = () => {
	let scss = [];
	let count = 0;
	let total;
	return new Promise((resolve, reject) => {
		fs.readdir(Utils.path('/client/scss/'))
			.then((files) => {
				total = files.length;
				return readFiles(files);
			})
			.then(() => scss.join())
			.then((fullScss) => {
				sass.render({ data: fullScss }, (err, result) => {
					if (err) throw err;
					else resolve(result.css.toString());
				});
			})
			.catch((err) => reject(err));
	});

	function readFiles(files) {
		return new Promise((resolve, reject) => {
			files.forEach((file) => {
				let filepath = Utils.path(`/client/scss/${file}`);
				fs.readFile(filepath)
					.then((bytes) => bytes.toString())
					.then((data) => scss.push(data))
					.then(() => (count++ , count === total) && resolve())
					.catch((err) => reject(err));
			});
		});
	}
}

exports.testIndex = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(Utils.path('/client/html/test_index.mustache'))
			.then((bytes) => bytes.toString())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
}