/* global it */

'use strict';

var memorize = require('./');
var assert = require('assert');

it('should throw on invalid middleware', function () {
	assert.throws(function () {
		memorize();
	});

	assert.throws(function () {
		memorize('wow');
	});
});

it('should call middleware only once', function () {
	var calls = 0;

	var cached = memorize(function (req, res, next) {
		calls++;
		next();
	});

	cached({});
	cached({});

	assert.equal(calls, 1);
});

it('should cache changes and apply them', function () {
	var req = {};

	var cached = memorize(function (req, res, next) {
		req.boop = true;
		next();
	});

	cached(req, {}, function () {
		assert.ok(req.boop);
	});
});

it('should clear cache on updateInterval', function (done) {
	var calls = 0;

	var cached = memorize(function (req, res, next) {
		calls++;
		next();
	}, {
		updateInterval: 100
	});

	cached({});
	setTimeout(function () {
		cached({});
		assert.equal(calls, 2);
		done();
	}, 150);
});

it('should pass error', function (done) {
	var cached = memorize(function (req, res, next) {
		next(new Error('Oh noez!'));
	});

	cached({}, {}, function (err) {
		assert.equal(err.message, 'Oh noez!');
		done();
	});
});

it('should not clear cache on error', function (done) {
	var i = 0;
	var cached = memorize(function (req, res, next) {
		if (i > 1) {
			next(new Error('Oh noez!'));
			return;
		}
		i++;
		req.boop = 'yes';
		next();
	});

	var req = {};
	cached(req, {}, function () {
		assert.equal(req.boop, 'yes');
		cached(req, {}, function () {
			assert.equal(req.boop, 'yes');
			done();
		});
	});
});
