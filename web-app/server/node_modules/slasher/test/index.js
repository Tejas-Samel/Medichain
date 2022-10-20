var slash = require('../');
var test = require('tape');

test('prefixes the path that does not already have a slash', function (t) {
  
	t.equal(slash('pathname'), '/pathname', 'added slash');
  t.equal(slash(123), '/123', 'added slash to number');
	t.end();
});

test('does not add a leading slash to a path that already has a leading slash', function (t) {
  
  t.equal(slash('/pathname'), '/pathname', 'no slash added');
  t.end();
});

test('adds leading slash to object with no options', function (t) {
  
  var obj = { key: 'value' };
  t.deepEqual(slash(obj), {'/key': '/value'}, 'added slash to all items');
  t.end();
});

test('adds leading slash to object for values only', function (t) {
  
  var obj = {key: 'value'};
  t.deepEqual(slash(obj, {key: false}), {key: '/value'}, 'added slash to value only');
  t.end();
});

test('adds leading slash to object for key only', function (t) {
  
  var obj = {key: 'value'};
  t.deepEqual(slash(obj, {value: false}), {'/key': 'value'}, 'added slash to key only');
  t.end();
});

test('returns the same data if it is an invalid data type', function (t) {
  
  var fn = function () {};
  t.equal(slash(fn).toString(), fn.toString(), 'returned same function');
  t.end();
});

test('does not add slashes to nested objects as values, only to the keys', function (t) {
  
  var obj = {
    key: {
      sub: 'value'
    }
  };
  
  t.deepEqual(slash(obj), {'/key': { sub: 'value'}}, 'skip nested objects');
  t.end();
});
