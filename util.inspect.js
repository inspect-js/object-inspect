try {
  module.exports = require('util').inspect;
} catch (_) {
  module.exports = {};
}
