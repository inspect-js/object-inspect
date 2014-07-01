var inspect = require('../');
var test = require('tape');

test('type error', function (t) {
    t.plan(1);
    var aerr = new TypeError;
    aerr.foo = 555;
    aerr.bar = [1,2,3];
    
    var berr = new TypeError('tuv');
    berr.baz = 555;
    
    var obj = [
        new TypeError,
        new TypeError('xxx'),
        aerr, berr
    ];
    t.equal(inspect(obj), '[' + [
        '[TypeError]',
        '[TypeError: xxx]',
        '{ [TypeError: xxx] foo: 555, bar: [ 1, 2, 3 ] }',
        '{ [TypeError: tuv] baz: 555 }',
    ].join(', ') + ']');
});
