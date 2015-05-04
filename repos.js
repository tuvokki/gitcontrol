var git = require('nodegit');
var sqrt = Math.sqrt;

function square(x) {
  return x * x;
}

var clone = function(x) {
  var result = x * x;
  console.log("clone result", result);
  return result;
},

pull = function(x, y) {
  console.log("pulling", x, y);
  var result = sqrt(square(x) + square(y));
  console.log("pull result", result);
  return result;
};

module.exports = {
  clone: clone,
  pull: pull
};
