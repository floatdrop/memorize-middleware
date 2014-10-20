function nop() {}

var assign  = require('object-assign'),
    events  = require('events');

module.exports = function (options, middleware) {
    if (typeof options === 'function') {
        middleware = options;
        options = {};
    }

    options = options || {};

    if (typeof middleware !== 'function') {
        throw new Error('middleware should be a function, not an ' + typeof middleware);
    }

    var cache = new events.EventEmitter();

    var updating = false;
    function updateCache() {
        var req = {};
        updating = true;

        middleware(req, undefined, function (err) {
            if (options.updateInterval > 0) {
                setTimeout(updateCache, options.updateInterval);
            }

            updating = false;
            if (err && options.breakOnError) { return cache.emit('error', err); }

            cache.result = req;
            cache.emit('ready', req);
        });
    }

    if (options.hotStart) { updateCache(); }

    return function memorize(req, res, next) {
        next = next || nop;

        if (options.breakOnError) {
            cache.once('error', function (err) {
                return next(err);
            });
        }

        if (cache.result) {
            assign(req, cache.result);
            return next();
        }

        cache.on('ready', function (data) {
            assign(req, data);
            return next();
        });

        if (!options.hotStart) {
            updateCache();
        }
    };
};
