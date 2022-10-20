var mix = require('../');
var test = require('tape');

var mixin = {
  value1: 'value1',
  method1: function () {}
};

test('mixes an object into another object', function (t) {
  var obj = {};
  mix(mixin).into(obj);
  
  t.equal(obj.value1, mixin.value1, 'copied value');
  t.equal(obj.method1.toString(), mixin.method1.toString(), 'copied value');
  t.end();
});

test('does not overwrite a property that already exists', function (t) {
  var obj = {
    value1: 'original value'
  };
  mix(mixin).into(obj);
  
  t.equal(obj.value1, 'original value', 'did not overwrite');
  t.end();
});

test('binds the context of the target object to new properties', function (t) {
  var obj = {
    originalProperty: 'test'
  };
  mix({
    getOp: function () {
      return this.originalProperty
    }
  }).into(obj);
  
  t.equal(obj.getOp(), 'test', 'bound context in method');
  t.end();
});

test('adds a mixing method to the mixed in object', function (t) {
  var obj = {objValue: 'obj value'};
  var obj2 = {obj2Value: 'obj2 value'};
  
  mix({mixValue: 'mix value'}).into(obj);
  obj.mixInto(obj2);
  
  t.ok(obj.mixInto, 'added the method');
  t.notOk(obj.obj2Value, 'did not add target to source');
  t.equal(obj.mixValue, 'mix value', 'added mixin value');
  
  t.ok(obj2.mixInto, 'mixed taret object into source object with mixInto method');
  t.equal(obj.objValue, 'obj value', 'add original object value');
  t.end();
});

test('creates wrapper to mix object into other objects', function (t) {
  var obj = {objValue: 'obj value'};
  var mixed = mix(mixin);
  
  mixed.mixInto(obj);
  
  t.equal(obj.value1, 'value1', 'mixin occurred');
  t.end();
});

test('returns mixed object', function (t) {
  var obj = {};
  obj = mix(mixin).into(obj);
  
  t.equal(obj.value1, 'value1', 'mixed the object');
  t.end();
});

test('returns a new object if no object is given', function (t) {
  var mixin = {
    value1: 'value1'
  };
  var mixed = mix(mixin);
  var obj = mixed.create();
  
  mixin.value1 = 'value2';
  
  t.equal(obj.value1, 'value1', 'mixed with no object');
  t.end();
});

test('deep clones the target object', function (t) {
  var mixin = {
    key1: 'value1'
  };
  var target = {
    key2: 'value2'
  };
  
  var mixedObject = mix(mixin).intoClone(target);
  
  t.ok(mixedObject.key1, 'mixin key');
  t.ok(mixedObject.key2, 'target key');
  
  target.key2 = 'new value2';
  
  t.equal(mixedObject.key2, 'value2', 'mixed object stays the same');
  t.end();
});