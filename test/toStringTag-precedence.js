'use strict';

var test = require('tape');
var mockProperty = require('mock-property');

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

    var inspectPath = require.resolve('../');
    var utilInspectPath = require.resolve('../util.inspect');

    var restoreSymbol = mockProperty(global, 'Symbol', { value: FakeSymbol });
    delete require.cache[inspectPath];
    delete require.cache[utilInspectPath];
    t.teardown(function () {
        restoreSymbol();
        delete require.cache[inspectPath];
        delete require.cache[utilInspectPath];
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
