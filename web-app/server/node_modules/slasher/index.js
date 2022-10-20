var path = require('path');
var toxic = require('toxic');

module.exports = function (data, options) {
  
  options = options || {};
  
  if (typeof data === 'string') {
    return normalize(data);
  }
  
  if (typeof data === 'number') {
    return normalize(data+'');
  }
  
  if (typeof data === 'object') {
    return toxic(data, {
      keyMutator: function (key) {
        
        return (options.key !== false)
          ? normalize(key)
          : key;
      },
      valueMutator: function (value) {
        
        return (options.value !== false && typeof value === 'string')
          ? normalize(value) :
          value;
      }
    })
  }
  
  return data;
};

function normalize (pathname) {
  
  return path.normalize(path.join('/', pathname));
}