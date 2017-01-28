var inspect = require('../');
var assert = require('assert');
var test = require('tape');

test('type error', function (t) {
    t.plan(1);
    var aerr = new TypeError;
    aerr.foo = 555;
    aerr.bar = [1,2,3];
    
    var berr = new TypeError('tuv');
    berr.baz = 555;
    
    var cerr = new SyntaxError;
    cerr.message = 'whoa';
    cerr['a-b'] = 5;
    
    var obj = [
        new TypeError,
        new TypeError('xxx'),
        aerr, berr, cerr
    ];
    t.equal(inspect(obj), '[ ' + [
        '[TypeError]',
        '[TypeError: xxx]',
        '{ [TypeError] foo: 555, bar: [ 1, 2, 3 ] }',
        '{ [TypeError: tuv] baz: 555 }',
        '{ [SyntaxError: whoa] message: \'whoa\', \'a-b\': 5 }'
    ].join(', ') + ' ]');
});

test('type AssertionError', function (t) {
    t.plan(3);
    var err = 'woot', obj2str = Object.prototype.toString;
    try {
      assert.deepStrictEqual(true, false);
    } catch (assertNope) {
      err = assertNope;
    }
    t.equal(err instanceof Error, true);
    t.equal(obj2str.call(err),    '[object Object]');
    t.equal(inspect(err),         '[' + String(err) + ']');
});
