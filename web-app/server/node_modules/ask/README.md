# ask

A simple, chainable way to construct HTTP requests in Node or the browser.

**Usage Environments:**

* [Node]()
* [Browser Standalone]()

## Install

Bower

```
bower install ask --save
```

NPM

```
npm install ask --save
```

## Usage

### Include in App

Standalone

```html
<script src="/bower_components/ask/dist/ask.js"></script>
```

Nodejs/Browserify

```js
var ask = require('ask');
```

### How to Build Requests

Simple `GET` request

```js
var request = ask({
  origin: '', /* default origin */
  headers: {/* set default headers */},
  xhrOptions: {/* default xhr options */
});

// Settings for all endpoints
request
  .origin('http://api.example.com')
  .header('Authorzation', 'Bearer 1234')
  .xhrOption('withCredentials', true);

// Create an endpoint and customize with endpoint-specific settings
// Returns a function to execute later
var getUserFriends = request
  .get('users', 123, 'friends')
  .query('page', 1)
  .query('limit', 10);

// Request to '/users/123/friends'
getUserFriends().then(function (res) {
  var users = res.body;
}, function (err) {
  // err.body
});
```

Simple `POST` request

```js
var request = ask();

request.origin('http://api.example.com');

var createUser = request.post('users');

// Send body data with request
createUser({
  name: 'example',
  email: 'something@aol.com'
}).then(function (res) {
	// Success!
});

```

## API

(Coming soon)

## Mocking HTTP Requests

A useful feature with Ask is the ability to intercept http/xhr requests and provide custom response attributes, such as statusCode, headers, etc. This is is very helpful when testing code that uses the Ask module.

Before building a request:

```js
var ask = require('ask');
var request = ask();

request
  .when('GET', '/some/path')
  .respond('custom response')
  .status(201)
  .header('content-type', 'text/html');

var somePath = request.get('some', 'path');

somePath().then(function (res) {
	
});
```

### Mocking API

#### when(method, path)

Set up the http mocking interceptor. Returns an object mocking helper methods

* `method` - GET, POST, PUT, DELETE, etc.
* `path` - the relative path to intercept

#### respond(body)

Set the response body text for the mocked request

* `body` - the data to set the response to

#### status(code)

Set the status code of the mocked response. Any code that is greater than or equal to 400 will cause the request promise to be rejected.

* `code` - a number, 200, 201, etc., that sets the statusCode of the response

#### header(name, value)

Set individual headers for the response. If no value is provided, the current header value is returned.

* `name` - the name of the header (case-insensitive)
* `value` - the value of the header

## Build

Builds standalone version

```
npm install
npm run build
```

## Run Tests

```
npm install
npm test
```