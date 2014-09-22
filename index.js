function nop() {}

module.exports = function (middleware, options) {
    options = options || {};

    if (typeof middleware !== 'function') {
        throw new Error('middleware should be a function, not an ' + typeof middleware);
    }

    return function memorize(req, res, next) {
        next = next || nop;

        next();
    };
};
