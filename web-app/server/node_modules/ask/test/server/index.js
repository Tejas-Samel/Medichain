var expect = require('chai').expect;
var Mocksy = require('mocksy');

var ask = require('../../index.js');

var server = new Mocksy({port: 9876});
var ORIGIN = 'http://localhost:9876';

describe('request instance', function () {
  var request;
  
  beforeEach(function (done) {
    request = ask();
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('sets defaults in the contructor', function () {
    request = ask({
      origin: ORIGIN,
      headers: {
        'Authorization': 'Bearer 1234'
      },
      xhrOptions: {
        'method': 'POST',
        'withCredentials': true
      }
    });
    
    expect(request.origin()).to.equal(ORIGIN);
    expect(request.header('Authorization')).to.equal('Bearer 1234');
    expect(request.xhrOption('method')).to.equal('POST');
  });
  
  it('sets the default origin for all http requests on the instance', function () {
    request.origin(ORIGIN);
    
    return request.get('test')().then(function (res) {
      expect(res.body.url).to.equal('/test');
      expect(res.body.method).to.equal('GET');
    });
  });
  
  it('sets the default headers for all http requests on the instance', function () {
    request
      .origin(ORIGIN)
      .header('Authorization', 'Bearer 1234');
    
    return request.get('test')().then(function (res) {
      expect(res.body.headers.authorization).to.equal('Bearer 1234');
    });
  });
  
  it('sets multiple headers from an object', function () {
    request
      .origin(ORIGIN)
      .header({
        'Authorization': 'Bearer 1234',
        'Content-Type': 'text/html'
      });
    
    return request.get('test')().then(function (res) {
      expect(res.body.headers.authorization).to.equal('Bearer 1234');
      expect(res.body.headers['content-type']).to.equal('text/html');
    });
  });
  
  it('sets the default xhr options for all http requests on the instance', function () {
    request
      .origin(ORIGIN)
      .xhrOption('method', 'POST');
    
    return request.get('test')().then(function (res) {
      expect(res.body.method).to.equal('POST');
    });
  });
  
});

describe('making bare requests', function () {
  var request;
  
  beforeEach(function (done) {
    request = ask();
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('makes a request with a given http method', function () {
    var apps = request.http('GET', ORIGIN, 'apps');
    
    return apps().then(function (res) {
      expect(res.body.method).to.equal('GET');
      expect(res.body.url).to.equal('/apps');
    });
  });
  
  // Helpers
  ask.HTTP_METHODS.forEach(function (method) {
    
    // EXAMPLE: request.get('url', 123)
    
    it('makes a ' + method + ' request', function () {
      var requester = request[method.toLowerCase()](ORIGIN, 'requester', 123);
      
      return requester().then(function (res) {
        expect(res.body.method).to.equal(method);
        expect(res.body.url).to.equal('/requester/123');
      });
    });
  });
  
  it('passes body parameters to various methods', function () {
    var create = request
      .origin(ORIGIN)
      .post('test');
    
    return create({key: 'value'}).then(function (res) {
      expect(res.body.body).to.eql({key: 'value'});
    });
  });
  
  it('extends a resource', function () {
    
    request
      .origin(ORIGIN);
    
    var tests = request
      .get('tests')
        .header('custom', 'header')
        .query('test', 'ing');
        
    var oneTest = tests
      .extend('123')
      .header('extended', 'header');
    
    expect(oneTest.url()).to.equal(ORIGIN + '/tests/123?test=ing');
    expect(oneTest.headers.custom).to.equal('header');
    expect(oneTest.headers.extended).to.equal('header');
  });
});

describe('setting options', function () {
  var request;
  var requester;
  
  beforeEach(function (done) {
    request = ask();
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('sets the request origin', function () {
    var requester = request
      .get('test')
      .origin(ORIGIN);
    
    return requester().then(function (res) {
      expect(res.body.url).to.equal('/test');
    });
  });
  
  it('sets the header for the request', function () {
    var requester = request
      .get('test')
      .origin(ORIGIN)
      .header('Authorization', 'Bearer 1234');
      
    return requester().then(function (res) {
      expect(res.body.headers.authorization).to.equal('Bearer 1234')
    });
  });
  
  it('sets an xhr options for the request', function () {
    var requester = request
      .get('test')
      .origin(ORIGIN)
      .xhrOption('method', 'POST')
      .xhrOption('form', {test: 'test'});
      
    return requester().then(function (res) {
      expect(res.body.method).to.equal('POST');
      expect(res.body.body).to.eql({test: 'test'});
    });
  });
  
  it('sets the default settings from the instance on the request', function () {
    request
      .origin(ORIGIN)
      .header('Authorization', 'Bearer 1234');
    
    var test = request.get('test');
    
    expect(test.origin()).to.equal(request.origin());
    expect(test.header('Authorization')).to.equal(request.header('Authorization'));
  });
  
  it('changing endpoint request settings does not modify the state of the instance', function () {
    var TEST_ORIGIN = 'http://localhost:1234';
    var TEST_ORIGIN2 = 'http://localhost:8888';
    
    // Instance
    request
      .origin(ORIGIN)
      .xhrOption('method', 'POST')
      .header('Authorization', 'Bearer 1234');
    
    // Endpoint
    var test = request
      .get('test')
      .origin(TEST_ORIGIN)
      .xhrOption('method', 'GET')
      .header('Authorization', 'Session 1234');
    
    var test2 = request
      .get('test2')
      .origin(TEST_ORIGIN2);
      
    expect(request.xhrOption('method')).to.equal('POST');
    expect(test.xhrOption('method')).to.equal('GET');
    
    expect(request.header('Authorization')).to.equal('Bearer 1234');
    expect(test.header('Authorization')).to.equal('Session 1234');
    
    expect(request.origin()).to.equal(ORIGIN);
    expect(test.origin()).to.equal(TEST_ORIGIN);
    expect(test2.origin()).to.equal(TEST_ORIGIN2);
  });
  
  it('gets the url of a resource', function () {
    var test = request
      .origin(ORIGIN)
      .get('test', 123);
    
    expect(request.url()).to.equal(ORIGIN + '/');
    expect(test.url()).to.equal(ORIGIN + '/test/123');
  });
  
});

describe('query strings', function () {
  var request;
  
  beforeEach(function (done) {
    request = ask();
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('returns a stringified version of query parameters', function () {
    var test = request
      .origin(ORIGIN)
      .query('page', 1)
      .query('name', 'name')
      .get('test');
    
    test.query('email', 'email');
    
    expect(request.query()).to.equal('page=1&name=name');
    expect(test.query()).to.equal('page=1&name=name&email=email');
  });
  
  it('adds query string parameters', function () {
    request
      .origin(ORIGIN)
      .query('page', 1)
      .query('limit', 10);
    
    var withoutQuery = request.get('test');
    var withQuery = request.get('test?name=name');
    
    expect(withoutQuery.url()).to.equal(ORIGIN + '/test?page=1&limit=10');
    expect(withQuery.url()).to.equal(ORIGIN + '/test?name=name&page=1&limit=10');
    
    return withoutQuery().then(function (res) {
      expect(res.body.url).to.equal('/test?page=1&limit=10');
    });
  });
  
  it('only adds the query parameter to the string if it has a value', function () {
    request
      .origin(ORIGIN)
      .query('page', 1)
      .query('limit', null);
    
    expect(request.url()).to.equal(ORIGIN + '/?page=1');
  });
  
  it('adds query parameters from an object', function () {
    request
      .origin(ORIGIN)
      .query({
        page: 1,
        limit: 10
      });
    
    expect(request.url()).to.equal(ORIGIN + '/?page=1&limit=10');
  });
  
});
  

  
