import test from 'ava';
import memorize from '.';

test('should throw on invalid middleware', t => {
	t.throws(() => {
		memorize();
	});

	t.throws(() => {
		memorize('wow');
	});
});

test('should call middleware only once', t => {
	let calls = 0;

	const cached = memorize((req, res, next) => {
		calls++;
		next();
	});

	cached({});
	cached({});

	t.is(calls, 1);
});

test.cb('should cache changes and apply them', t => {
	const req = {};

	const cached = memorize((req, res, next) => {
		req.boop = true;
		next();
	});

	cached(req, {}, () => {
		t.true(req.boop);
		t.end();
	});
});

test.cb('should clear cache on updateInterval', t => {
	let calls = 0;

	const cached = memorize((req, res, next) => {
		calls++;
		next();
	}, {
		updateInterval: 100
	});

	cached({});
	setTimeout(() => {
		cached({});
		t.is(calls, 2);
		t.end();
	}, 150);
});

test.cb('should pass error', t => {
	const cached = memorize((req, res, next) => {
		next(new Error('Oh noez!'));
	});

	cached({}, {}, err => {
		t.is(err.message, 'Oh noez!');
		t.end();
	});
});

test.cb('should not clear cache on error', t => {
	let i = 0;
	const cached = memorize((req, res, next) => {
		if (i > 1) {
			next(new Error('Oh noez!'));
			return;
		}
		i++;
		req.boop = 'yes';
		next();
	});

	const req = {};
	cached(req, {}, () => {
		t.is(req.boop, 'yes');
		cached(req, {}, () => {
			t.is(req.boop, 'yes');
			t.end();
		});
	});
});

/**
 * Unhandle promise rejections are not handled by mocha so far,
 * so we have to look at the stderr
 *
 * @see https://github.com/mochajs/mocha/issues/2640#issuecomment-409656138
 */
test.cb('should not emit unhandled promise rejection', t => {
	const cached = memorize((req, res, next) => {
		next(new Error('Oh noez!'));
	});

	setImmediate(() => {
		cached({}, {}, err => {
			t.is(err.message, 'Oh noez!');
			t.end();
		});
	});
});
