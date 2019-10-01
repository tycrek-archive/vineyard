var fs = require('fs-extra');

var Utils = this;

exports.init = () => {
	return new Promise((resolve, reject) => {
		fs.readJson(Utils.path('config.json'))
			.then((obj) => exports.config = obj)
			.then(() => resolve(Utils.config.server))
			.catch((err) => reject(err));
	});
}

exports.path = (file) => require('path').join(__dirname, file);