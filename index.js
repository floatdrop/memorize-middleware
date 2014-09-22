function nop() {}

var assign = require('object-assign');

module.exports = function (options, middleware) {
    if (typeof options === 'function') {
        middleware = options;
        options = {};
    }

    options = options || {};

    if (typeof middleware !== 'function') {
        throw new Error('middleware should be a function, not an ' + typeof middleware);
    }

    var cached;

    return function memorize(req, res, next) {
        next = next || nop;

        if (cached) {
            assign(req, cached);
            return next();
        }

        cached = {};
        middleware(cached, undefined, function (err) {
            if (err) { return next(err); }

            if (options.updateInterval > 0) {
                setTimeout(function () { cached = null; }, options.updateInterval);
            }

            assign(req, cached);
            next();
        });
    };
};
