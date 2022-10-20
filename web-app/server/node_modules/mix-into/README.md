# mix-into

Mix objects into other objects.

By adopting the "mix into" methodology, your code avoids the mess of "add this mixin; add this mixin; add this mixin". Istead, you can dynamically nest and defer the the mixin process.

## Install

```
npm isntall mix-into --save
```

## Usage

#### Basic

```js
var mix = require('mix-into');
var baseMixin = {
  baseValue: 'some value',
  baseMethod: function () {
    return baseValue;
  }
};

var obj = {};

mix(baseMixin).into(obj);

obj.baseMethod(); // OUTPUTS: 'some value'
```

#### Partial Applied Mixin

```js
var mix = require('mix-into');
var baseMixin = mix({
  baseValue: 'some value',
  baseMethod: function () {
    return baseValue;
  }
});
var obj = {};

baseMixin.mixInto(obj);

obj.baseMethod() // OUTPUS: 'some value'
```

#### Nested Mixins

```js
var mix = require('mix-into');
var baseMixin = mix({
  baseValue: 'some value',
  baseMethod: function () {
    return baseValue;
  }
});

var obj = {
  objMethod: function () {
    return this.baseValue;
  }
};
var obj2 = {};

baseMixin.mixInto(obj);
obj.mixInto(obj2); // mixInto method added to each object that's mixed into

obj2.objMethod() // OUTPUS: 'some value'
```

#### Create New Object from Mixin

```js
var mix = require('mix-into');
var baseMixin = mix({
  value1: 'value1'
});

var obj = baseMixin.create();

console.log(obj.value1); // OUTPUTS: 'value1'
```

## Run Tests

```
npm install
npm test
```