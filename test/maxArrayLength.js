var test = require('tape');
var forEach = require('for-each');

var inspect = require('../');

test('bad maxArrayLength options', function (t) {
    forEach([
        -1,
        -Infinity,
        NaN,
        1.5,
        'string',
        true,
        false,
        {},
        []
    ], function (maxArrayLength) {
        t['throws'](
            function () { inspect('', { maxArrayLength: maxArrayLength }); },
            TypeError,
            inspect(maxArrayLength) + ' is invalid'
        );
    });

    t.end();
});

test('valid maxArrayLength options', function (t) {
    forEach([
        0,
        1,
        10,
        Infinity,
        null
    ], function (maxArrayLength) {
        t.doesNotThrow(
            function () { inspect([], { maxArrayLength: maxArrayLength }); },
            inspect(maxArrayLength) + ' is valid'
        );
    });

    t.end();
});

test('maxArrayLength with arrays', function (t) {
    var arr = [1, 2, 3, 4, 5];

    t.equal(
        inspect(arr, { maxArrayLength: 3 }),
        '[ 1, 2, 3, ... 2 more items ]',
        'array truncated at maxArrayLength'
    );

    t.equal(
        inspect(arr, { maxArrayLength: 5 }),
        '[ 1, 2, 3, 4, 5 ]',
        'array not truncated when length equals maxArrayLength'
    );

    t.equal(
        inspect(arr, { maxArrayLength: 10 }),
        '[ 1, 2, 3, 4, 5 ]',
        'array not truncated when maxArrayLength exceeds length'
    );

    t.equal(
        inspect(arr, { maxArrayLength: 0 }),
        '[ ... 5 more items ]',
        'maxArrayLength of 0 shows all as truncated'
    );

    t.equal(
        inspect([1], { maxArrayLength: 0 }),
        '[ ... 1 more item ]',
        'singular item message when one item truncated'
    );

    t.equal(
        inspect(arr, { maxArrayLength: Infinity }),
        '[ 1, 2, 3, 4, 5 ]',
        'Infinity shows all elements'
    );

    t.equal(
        inspect(arr, { maxArrayLength: null }),
        '[ 1, 2, 3, 4, 5 ]',
        'null shows all elements (default behavior)'
    );

    t.end();
});

test('maxArrayLength with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    map.set('d', 4);

    t.equal(
        inspect(map, { maxArrayLength: 2 }),
        "Map (4) {'a' => 1, 'b' => 2, ... 2 more items}",
        'Map truncated at maxArrayLength'
    );

    t.equal(
        inspect(map, { maxArrayLength: 4 }),
        "Map (4) {'a' => 1, 'b' => 2, 'c' => 3, 'd' => 4}",
        'Map not truncated when length equals maxArrayLength'
    );

    t.end();
});

test('maxArrayLength with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    set.add(4);

    t.equal(
        inspect(set, { maxArrayLength: 2 }),
        'Set (4) {1, 2, ... 2 more items}',
        'Set truncated at maxArrayLength'
    );

    t.equal(
        inspect(set, { maxArrayLength: 4 }),
        'Set (4) {1, 2, 3, 4}',
        'Set not truncated when length equals maxArrayLength'
    );

    t.end();
});

test('maxArrayLength with nested arrays', function (t) {
    var arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    // maxArrayLength applies to all arrays at all depths (like util.inspect)
    t.equal(
        inspect(arr, { maxArrayLength: 2 }),
        '[ [ 1, 2, ... 1 more item ], [ 4, 5, ... 1 more item ], ... 1 more item ]',
        'maxArrayLength applied recursively to nested arrays'
    );

    t.end();
});
