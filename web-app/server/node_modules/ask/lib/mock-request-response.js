module.exports = function (context, method, pathname) {
  return {
    context: context,
    method: method,
    pathname: pathname,
    body: null,
    statusCode: 200,
    headers: {},
    
    respond: function (body) {
      this.body = body;
      this.context.mock(this.method, this.pathname, this);
      return this;
    },
    
    status: function (code) {
      if (code === undefined) return this.statusCode;
      this.statusCode = code;
      return this;
    },
    
    header: function (name, value) {
      if (value === undefined) return this.headers[name.toLowerCase()];
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    
    // Custom function to return when a mock is present
    fn: function () {
      var self = this;
      return function () {
        var status = self.statusCode;
        
        if (status === 0 || (status >= 400 && status < 600)) {
          return context.asRejectedPromise(self);
        }
        
        return context.asPromise(self);
      };
    }
  };
};