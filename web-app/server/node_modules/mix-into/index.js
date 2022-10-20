var clone = require('deap').clone;

var mix = function (source) {
  return new Mix(source);
};

var Mix = function (source) {
  this.source = source;
};

Mix.prototype.into = function (target) {
  target = target || {};
  
  var keys = Object.keys(this.source);
  var len = keys.length;
  var i = 0;
  var key;
  var val;
  
  for (i; i < len; i += 1) {
    key = keys[i]
    val = this.source[key];
    
    if (target[key] === undefined) target[key] = this.source[key];
  }
  
  if (target.mixInto === undefined) target.mixInto = mixInto;
  
  return target;
};

Mix.prototype.intoClone = function (target) {
  return this.into(clone(target));
};

Mix.prototype.mixInto = function (target) {
  return this.into(target);
};

Mix.prototype.create = function () {
  return clone(this.source);
};

function mixInto (source) {
  return mix(this).into(source);
}

module.exports = mix;