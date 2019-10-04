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

// Encode a string as Base64
exports.str2b64 = (str) => Buffer.from(str).toString('base64');

// Decode Base64 data into a string
exports.b642str = (b64) => Buffer.from(b64, 'base64').toString();