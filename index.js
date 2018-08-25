'use strict';

function nop() {}

module.exports = function (middleware, opts) {
	if (typeof middleware !== 'function') {
		throw new TypeError('middleware should be a function, not an ' + typeof middleware);
	}

	opts = opts || {};

	const {updateInterval} = opts;

	const middlewarePromise = function () {
		return new Promise(((resolve, reject) => {
			const req = {};

			middleware(req, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve(req);
			});
		}));
	};

	function setupUpdate() {
		if (updateInterval) {
			setTimeout(updateLoop, updateInterval);
		}
	}

	let cache = middlewarePromise();

	cache.catch(nop);

	function updateLoop() {
		const promise = middlewarePromise();
		promise
			.then(() => {
				cache = promise;
				setupUpdate();
			}, setupUpdate);
	}

	setupUpdate();

	function memorize(req, res, next) {
		next = next || nop;

		cache
			.then(data => {
				Object.assign(req, data);
				return next();
			})
			.catch(next);
	}

	return memorize;
};
