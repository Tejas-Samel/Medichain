var expect = require('chai').expect;
var Mocksy = require('mocksy');

var ask = require('../../index.js');

var server = new Mocksy({port: 9876});
var ORIGIN = 'http://localhost:9876';

describe('events on http requests', function () {
  
  var request;
  
  beforeEach(function (done) {
    
    request = ask({
      origin: ORIGIN
    });
    server.start(done);
  });
  
  afterEach(function (done) {
    
    server.stop(done);
  });
  
  it('response', function () {
    
    var responseEmitted = false
    var get = request.get('testing', 'me');
    
    request.events.on('response', function (data) {
      
      responseEmitted = true;
      
      expect(data.err).to.equal(undefined);
      expect(data.response.body).to.not.equal(undefined);
    });
    
    return get().then(function () {
      
      expect(responseEmitted).to.equal(true);
    });
  });
  
  it('response:success', function () {
    
    var responseEmitted = false
    var get = request.get('testing', 'me');
    
    request.events.on('response:success', function (response) {
      
      responseEmitted = true;
      
      expect(response.statusCode).equal(200);
    });
    
    return get().then(function () {
      
      expect(responseEmitted).to.equal(true);
    });
  });
  
  it.skip('response:error', function () {
    
    // TODO: implement test
  });
});