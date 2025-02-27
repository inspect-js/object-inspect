try {
    // eslint-disable-next-line global-require
    module.exports = require('util').inspect;
} catch (_) {
    module.exports = {};
}
