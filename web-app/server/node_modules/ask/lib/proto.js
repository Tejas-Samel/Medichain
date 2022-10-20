var mix = require('mix-into');
var join = require('join-path');
var extend = require('deap').extend;

// Proto mixin
module.exports = mix({
  origin: function (origin) {
    if (!this.attributes) this.attributes = {};
    if (!origin) return this.attributes.origin;
    
    this.attributes.origin = origin;
    return this;
  },
  
  header: function (name, value) {
    if (!this.headers) this.headers = {};
    
    if (typeof name === 'object') {
      extend(this.headers, name);
      return this;
    }
    
    if (name && !value) return this.headers[name];
    
    this.headers[name] = value;
    return this;
  },
  
  query: function (name, value) {
    if (!this.queries) this.queries = {};
    
    // Parse query string
    if (!name && !value) return parseQueryString(this.queries);
    
    // Add values from an object
    if (typeof name === 'object') {
      extend(this.queries, name);
      return this;
    }
    
    if (name && !value) return this.queries[name];
    
    this.queries[name] = value;
    return this;
  },
  
  xhrOption: function (name, value) {
    if (!this.xhrOptions) this.xhrOptions = {};
    if (name && !value) return this.xhrOptions[name];
    
    this.xhrOptions[name] = value;
    return this;
  },
  
  url: function () {
    var url = this._uri;
    if (this.origin()) url = join(this.origin(), this._uri);
    
    // Add query string
    if (Object.keys(this.queries || {}).length > 0) {
      var connector = (url.indexOf('?') > -1) ? '&' : '?';
      url = url + connector + this.query();
    }
    
    return url || '/';
  }
});

function parseQueryString (queryObject) {
  var qs = [];
  
  Object
    .keys(queryObject)
    .forEach(function (key) {
      var value = queryObject[key];
      
      if (value) qs.push(key + '=' + value);
    }, this);
  
  return qs.join('&');
}