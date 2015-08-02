# memorize-middleware

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Save changes, that middleware did on req and apply them after

## Usage

```js
var express = require('express');
var app = express();
var memorize = require('memorize-middleware');

var middleware = function (req, res, next) {
    console.log('Called once');
    req.message = 'Boop!';
    next();
};

app.use(memorize(middleware));
app.get('/', function (req, res, next) {
    res.send(req.message);
});

app.listen(8080);
```

### States

There are couple states in which `memorize` works:

1. __There is no cache__ - all requests will be halted, while result is pending.
2. __Middleware failed and there is no cached value__ - Error will be passed to next middleware.
3. __Result recieved__ - It will be stored, all pending clients will get result, all next clients will get. this result instantly. If `updateInterval` set - it will be scheduled.
4. __Result not recieved in update time__ - Nothing will happen, all clients will recieve previous version, new update will be scheduled.
5. __Result recieved in update time__ - Previous result will be swapped with new one.

## API

### memorize([options], middleware)

Creates middleware, that will call `middleware` and cache changes, that it did to req object.

#### middleware
Type: `Function`

Middleware, which changes should be cached.

#### options

##### updateInterval
Type: `Number`  
Default: `0` — never

How often (in milliseconds) should `memorize` request new data for middleware. Don't make it too low.

## License

The MIT License (MIT) © [Vsevolod Strukchinsky](floatdrop@gmail.com)

[npm-url]: https://npmjs.org/package/memorize-middleware
[npm-image]: http://img.shields.io/npm/v/memorize-middleware.svg?style=flat

[travis-url]: https://travis-ci.org/floatdrop/memorize-middleware
[travis-image]: http://img.shields.io/travis/floatdrop/memorize-middleware.svg?style=flat

[depstat-url]: https://david-dm.org/floatdrop/memorize-middleware
[depstat-image]: http://img.shields.io/david/floatdrop/memorize-middleware.svg?style=flat
