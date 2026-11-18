'use strict';

var test = require('tape');
var mockProperty = require('mock-property');
var requireStash = require('require-stash');

test('circular-reference tracking is linear in the number of siblings', function (t) {
    var origSlice = Array.prototype.slice;
    var copied = 0;
    var restoreSlice = mockProperty(Array.prototype, 'slice', {
        value: function slice() {
            copied += this.length;
            return origSlice.apply(this, arguments);
        }
    });
    var restoreInspect = requireStash(__dirname, '../');
    t.teardown(function () {
        restoreSlice();
        restoreInspect();
    });

    var freshInspect = require('../'); // eslint-disable-line global-require

    var n = 1000;
    var arr = [];
    for (var i = 0; i < n; i++) {
        arr[arr.length] = {};
    }

    copied = 0;
    freshInspect([arr]);
    var total = copied;

    t.ok(total <= 2 * n, 'copies of the `seen` list grow linearly (' + total + ' elements copied for ' + n + ' siblings)');

    t.end();
});
