/* global it */

var memorize = require('..');
require('should');

it('should throw on invalid middleware', function () {
    (function () { memorize(); }).should.throw();
    (function () { memorize('wow'); }).should.throw();
});

it('should call middleware only once', function () {
    var calls = 0;

    var cached = memorize(function (req, res, next) {
        calls ++;
        next();
    });

    cached({});
    cached({});

    calls.should.eql(1);
});

it('should cache changes and apply them', function () {
    var req = {};

    var cached = memorize(function (req, res, next) {
        req.boop = true;
        next();
    });

    cached({});
    cached(req);

    req.should.have.property('boop', true);
});

it('should clear cache on updateInterval', function (done) {
    var calls = 0;

    var cached = memorize({ updateInterval: 10 }, function (req, res, next) {
        calls ++;
        next();
    });

    cached({});
    setTimeout(function () {
        cached({});
        calls.should.eql(2);
        done();
    }, 20);
});

it('should call middleware right after init with hotStart', function (done) {
    memorize({ hotStart: true }, function () { done(); });
});

it('should pass error with breakOnError', function (done) {
    var cached = memorize({ breakOnError: true }, function (req, res, next) { next(new Error('Oh noez!')); });
    cached({}, {}, function (err) {
        if (!err) { return done('Error was not passed to callback'); }
        done();
    });
});

it('should not raise warning when 10+ listeners are set', function (done) {
    var cached = memorize(function (req, res, next) {
        setTimeout(function () {
            req.boop = true;
            next();

            done();
        }, 10);
    });

    for (var i = 0; i < 20; i++) {
        cached({});
    }
});

it('should not fail when error is emitted without listener', function (done) {
    var cached = memorize({ updateInterval: 10, hotStart: true, breakOnError: true }, function (req, res, next) {
        next(new Error('oh my...'));
    });

    setTimeout(done, 20);
});
