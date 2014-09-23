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
};

app.use(memorize(middleware));
app.get('/', function (req, res, next) {
    res.send(req.message);
});

app.listen(8080);
```

## API

### memorize([options], middleware)

Creates middleware, that will call `middleware` and cache changes, that it did to req object.

#### middleware
Type: `Function`

Middleware, which changes should be cached.

#### options

##### hotStart
Type: `Boolean`  
Default: `false`

If enabled, middleware will be executed on startup, instead of be executed on first request.

##### updateInterval
Type: `Number`  
Default: `0` — never

How often (in milliseconds) should `memorize` forget cached changes. Don't make it too low.

## License

The MIT License (MIT) © [Vsevolod Strukchinsky](floatdrop@gmail.com)

[npm-url]: https://npmjs.org/package/memorize-middleware
[npm-image]: http://img.shields.io/npm/v/memorize-middleware.svg?style=flat

[travis-url]: https://travis-ci.org/floatdrop/memorize-middleware
[travis-image]: http://img.shields.io/travis/floatdrop/memorize-middleware.svg?style=flat

[depstat-url]: https://david-dm.org/floatdrop/memorize-middleware
[depstat-image]: http://img.shields.io/david/floatdrop/memorize-middleware.svg?style=flat
