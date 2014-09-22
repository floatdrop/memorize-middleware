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
