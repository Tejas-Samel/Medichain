var asArray = require('as-array');
var slash = require('slasher');
var request = require('httpify');
var join = require('join-path');
var Promise = require('promise');
var deap = require('deap');
var Emitter = require('tiny-emitter');

var proto = require('./lib/proto');
var mockRequestResponse = require('./lib/mock-request-response');

var clone = deap.clone;
var extend = deap.extend;

var HTTP_METHODS = 'GET POST PUT DELETE PATCH OPTIONS'.split(' ');

//
function Ask (options) {
  if (!(this instanceof Ask)) return new Ask(options);
  if (!options) options = {};
  
  this.origin(options.origin);
  this.headers = clone(options.headers);
  this.xhrOptions = clone(options.xhrOptions);
  this.events = new Emitter();
  
  this.resources = {};
  
  // Set up http method mocks
  this.mocks = {};
  HTTP_METHODS.forEach(function (method) {
    this.mocks[method.toLowerCase()] = {};
  }, this);
}

Ask.HTTP_METHODS = HTTP_METHODS;
Ask.join = join;
proto.mixInto(Ask.prototype);

Ask.prototype._rawHttp = function (options) {
  
  var self = this;
  
  return request(options, function (err, response) {
    
    self.events.emit('response', {
      error: err,
      response: response
    });
    
    if (err || response.statusCode >= 400) {
      self.events.emit('response:error', err || response);
    }
    
    if (!err) {
      self.events.emit('response:success', response);
    }
  });
};

Ask.prototype.promise = function (callback) {
  return new Promise(callback);
};

Ask.prototype.asPromise = function (data) {
  return this.promise(function (resolve) {
    resolve(data);
  });
};

Ask.prototype.asRejectedPromise = function (data) {
  return this.promise(function (resolve, reject) {
    reject(data);
  });
};

Ask.prototype.mock = function (method, pathname, mockObject) {
  if (mockObject === undefined) return this.mocks[method.toLowerCase()][slash(pathname)]; 
  
  return this.mocks[method.toLowerCase()][slash(pathname)] = mockObject;
};

Ask.prototype.http = function (method) {
  
  var self = this;
  var rawHttp = this._rawHttp.bind(this);
  var uri = rest(asArray(arguments)).join('/');
  
  // New resource object
  var resource = function (params) {
    var resourceObject = {
      url: resource.url(),
      method: method,
      headers: resource.headers
    };
    
    if (typeof params === 'object') {
      resourceObject.json = true;
      resourceObject.body = params;
    }
    else if (typeof params === 'string') {
      resourceObject.body = params;
    }
    
    // Should this resource be mocked, or real?
    // It is ensured that you can define the mock before
    // or after the resource is defined
    var mock = self.mock(method, uri);
    if (mock) {
      mock.request = {
        body: params,
        method: method,
        pathname: slash(uri),
        headers: resource.headers
      };
      return mock.fn()();
    }
    else {
      return rawHttp(extend(resourceObject, resource.xhrOptions || {}));
    }
  };
  
  resource._uri = uri;
  resource.attributes = clone(this.attributes);
  resource.headers = clone(this.headers);
  resource.xhrOptions = clone(this.xhrOptions);
  resource.queries = clone(this.queries);
  
  resource.extend = function () {
    
    var extended = clone(resource);
    extended._uri = join(resource._uri + '/' + asArray(arguments).join('/'));
    
    return extended;
  };
  
  proto.mixInto(resource);
  
  // Store resources
  this.resources[resource.url()] = resource;
  
  return resource;
};

Ask.prototype.when = function (method, pathname) {
  var mockedRequest = mockRequestResponse(this, method, pathname);
  return this.mock(method, pathname, mockedRequest);
};

// Create help http verb functions
Ask.HTTP_METHODS.forEach(function (method) {
  Ask.prototype[method.toLowerCase()] = function () {
    var args = asArray(arguments);
    args.unshift(method);
    
    return this.http.apply(this, args);
  };
});

function rest (arr) {
  return arr.slice(1);
}

//
module.exports = Ask;