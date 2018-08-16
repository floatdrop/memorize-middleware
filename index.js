'use strict';

function nop() {}

var assign = require('object-assign');
var PinkiePromise = require('pinkie-promise');

module.exports = function (middleware, opts) {
	if (typeof middleware !== 'function') {
		throw new Error('middleware should be a function, not an ' + typeof middleware);
	}

	opts = opts || {};

	var updateInterval = opts.updateInterval;

	var middlewarePromise = function () {
		return new PinkiePromise(function (resolve, reject) {
			var req = {};

			middleware(req, {}, function (err) {
				if (err) {
					reject(err);
					return;
				}

				resolve(req);
			});
		});
	};

	function setupUpdate() {
		if (updateInterval) {
			setTimeout(updateLoop, updateInterval);
		}
	}

	var cache = middlewarePromise();

	cache.catch(nop);

	function updateLoop() {
		var promise = middlewarePromise();
		promise
			.then(function () {
				cache = promise;
				setupUpdate();
			}, setupUpdate);
	}

	setupUpdate();

	return function memorize(req, res, next) {
		next = next || nop;

		cache
			.then(function (data) {
				assign(req, data);
				return next();
			})
			.catch(next);
	};
};
