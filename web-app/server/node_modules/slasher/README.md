# slasher

Prefix a path with leading slash

## Install

```
npm install slasher --save
```

## Usage

```js
var slash = require('slasher');

// Strings
var pathname = 'some/path/to/something';
var pathname = slash(pathname); // OUTPUTS: '/some/path/to/something'

// Objects
var paths = {
  'some/route': 'index.html'
};
var paths = slash(paths);

// OUTPUTS:
{
  '/some/route': '/index.html'
}
```

### slash(data[, options])

* `data` - a string or object to slash
* `options` - OPTIONAL. Set `key` or `value` to **false** to not add a slash to those values in an object

## Run Tests

```
npm install
npm test
```