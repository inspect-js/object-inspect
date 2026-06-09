'use strict';

var test = require('tape');
var mockProperty = require('mock-property');
var requireStash = require('require-stash');

/*
 * Regression test for a ternary-precedence bug where the guard
 *   typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol'
 * collapsed to a constant-truthy `'symbol'` (because `typeof x` is a string
 * and `hasShammedSymbols` is a boolean), so a truthy-but-wrong-type
 * `Symbol.toStringTag` (e.g. a string on a broken polyfill) was accepted as
 * a valid toStringTag. The fix parenthesizes the inner ternary so the
 * `typeof` is compared against the expected string.
 */

function FakeSymbol() {}
FakeSymbol.toStringTag = 'tag'; // truthy, but `typeof` is 'string', not 'symbol'
FakeSymbol.iterator = function () {}; // keep hasShammedSymbols false

function C() {}
C.prototype[FakeSymbol.toStringTag] = 'Oops';

test('toStringTag precedence', function (t) {
    t.plan(1);

    var restoreSymbol = mockProperty(global, 'Symbol', { value: FakeSymbol });
    var restoreInspect = requireStash(__dirname, '../');
    var restoreUtilInspect = requireStash(__dirname, '../util.inspect');
    t.teardown(function () {
        restoreSymbol();
        restoreInspect();
        restoreUtilInspect();
    });

    var freshInspect = require('../'); // eslint-disable-line global-require

    /*
     * With the bug, `toStringTag` inside the module would be the string
     * `'tag'`, and `'tag' in new C()` is true via the prototype chain,
     * so inspect would splice a bogus `[Object]` tag into its output.
     */
    t.equal(
        freshInspect(new C()),
        'C {}',
        'non-symbol `Symbol.toStringTag` is rejected and does not leak into output'
    );
});
