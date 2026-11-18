'use strict';

var inspect = require('../');

var test = require('tape');
var globalThis = require('globalthis')();

test('global object', function (t) {
    /* global window */
    var expected = typeof window === 'undefined' ? 'globalThis' : 'Window';
    t.equal(
        inspect([globalThis]),
        '[ { [object ' + expected + '] } ]'
    );

    t.end();
});
