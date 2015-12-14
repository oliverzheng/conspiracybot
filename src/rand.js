var random = require('random-js');

module.exports = function rand(a, b) {
  return random.integer(a, b)(random.engines.nativeMath);
}
