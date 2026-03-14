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

test('maxArrayLength with empty collections', function (t) {
    t.equal(
        inspect([], { maxArrayLength: 0 }),
        '[]',
        'empty array with maxArrayLength 0'
    );

    t.equal(
        inspect([], { maxArrayLength: 5 }),
        '[]',
        'empty array with maxArrayLength 5'
    );

    t.end();
});

test('maxArrayLength with empty Map', { skip: typeof Map !== 'function' }, function (t) {
    var emptyMap = new Map();

    t.equal(
        inspect(emptyMap, { maxArrayLength: 0 }),
        'Map (0) {}',
        'empty Map with maxArrayLength 0'
    );

    t.end();
});

test('maxArrayLength with empty Set', { skip: typeof Set !== 'function' }, function (t) {
    var emptySet = new Set();

    t.equal(
        inspect(emptySet, { maxArrayLength: 0 }),
        'Set (0) {}',
        'empty Set with maxArrayLength 0'
    );

    t.end();
});

test('maxArrayLength of 1', function (t) {
    t.equal(
        inspect([1, 2, 3], { maxArrayLength: 1 }),
        '[ 1, ... 2 more items ]',
        'array with maxArrayLength 1'
    );

    t.equal(
        inspect([1], { maxArrayLength: 1 }),
        '[ 1 ]',
        'single element array with maxArrayLength 1'
    );

    t.end();
});

test('maxArrayLength of 1 with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);

    t.equal(
        inspect(map, { maxArrayLength: 1 }),
        "Map (2) {'a' => 1, ... 1 more item}",
        'Map with maxArrayLength 1'
    );

    t.end();
});

test('maxArrayLength of 1 with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set([1, 2]);

    t.equal(
        inspect(set, { maxArrayLength: 1 }),
        'Set (2) {1, ... 1 more item}',
        'Set with maxArrayLength 1'
    );

    t.end();
});

test('maxArrayLength with sparse arrays', function (t) {
    var sparse = [1, , , 4, 5]; // eslint-disable-line no-sparse-arrays

    t.equal(
        inspect(sparse, { maxArrayLength: 3 }),
        '[ 1, , , ... 2 more items ]',
        'sparse array truncated at maxArrayLength'
    );

    t.equal(
        inspect(sparse, { maxArrayLength: 2 }),
        '[ 1, , ... 3 more items ]',
        'sparse array with maxArrayLength 2'
    );

    t.end();
});

test('maxArrayLength with arrays containing undefined and null', function (t) {
    var arr = [undefined, null, 1, undefined, null];

    t.equal(
        inspect(arr, { maxArrayLength: 3 }),
        '[ undefined, null, 1, ... 2 more items ]',
        'array with undefined/null truncated at maxArrayLength'
    );

    t.equal(
        inspect(arr, { maxArrayLength: 2 }),
        '[ undefined, null, ... 3 more items ]',
        'array with undefined/null at maxArrayLength 2'
    );

    t.end();
});

test('maxArrayLength with indent option', function (t) {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var result = inspect(arr, { maxArrayLength: 5, indent: 2 });
    t.ok(
        result.indexOf('... 5 more items') > -1,
        'truncation message present with indent'
    );

    // With enough items shown, indent should produce newlines
    var longArr = [];
    for (var i = 0; i < 20; i++) {
        longArr.push({ key: 'value' + i });
    }
    var longResult = inspect(longArr, { maxArrayLength: 10, indent: 2 });
    t.ok(
        longResult.indexOf('\n') > -1,
        'newlines present with indent on complex array'
    );

    t.end();
});

test('maxArrayLength with depth option', function (t) {
    var nested = { arr: [1, 2, 3, 4, 5] };

    t.equal(
        inspect(nested, { maxArrayLength: 2, depth: 2 }),
        '{ arr: [ 1, 2, ... 3 more items ] }',
        'maxArrayLength works with depth option'
    );

    // When depth is exceeded, array shows as [Array] regardless of maxArrayLength
    t.equal(
        inspect(nested, { maxArrayLength: 2, depth: 1 }),
        '{ arr: [Array] }',
        'depth limit shows [Array] regardless of maxArrayLength'
    );

    t.end();
});

test('maxArrayLength with large values', function (t) {
    var arr = [];
    for (var i = 0; i < 100; i++) {
        arr.push(i);
    }

    t.equal(
        inspect(arr, { maxArrayLength: 1000 }),
        inspect(arr),
        'maxArrayLength larger than array length shows all'
    );

    var result = inspect(arr, { maxArrayLength: 5 });
    t.ok(
        result.indexOf('... 95 more items') > -1,
        'large array truncated correctly'
    );

    t.end();
});

test('maxArrayLength with objects inside arrays', function (t) {
    var arr = [{ a: 1 }, { b: 2 }, { c: 3 }];

    t.equal(
        inspect(arr, { maxArrayLength: 2 }),
        '[ { a: 1 }, { b: 2 }, ... 1 more item ]',
        'array of objects truncated at maxArrayLength'
    );

    t.end();
});

test('maxArrayLength with functions inside arrays', function (t) {
    function testFn() {}
    var arr = [testFn, testFn, testFn];

    t.equal(
        inspect(arr, { maxArrayLength: 1 }),
        '[ [Function: testFn], ... 2 more items ]',
        'array of functions truncated at maxArrayLength'
    );

    t.end();
});

test('maxArrayLength does not affect non-array objects', function (t) {
    var obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

    t.equal(
        inspect(obj, { maxArrayLength: 2 }),
        '{ a: 1, b: 2, c: 3, d: 4, e: 5 }',
        'maxArrayLength does not affect plain objects'
    );

    t.end();
});

test('maxArrayLength with arguments object', function (t) {
    var args = (function () { return arguments; }(1, 2, 3, 4, 5));

    // arguments objects are treated as objects, not arrays, so maxArrayLength doesn't apply
    t.equal(
        inspect(args, { maxArrayLength: 2 }),
        '{ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 }',
        'maxArrayLength does not affect arguments object (treated as object)'
    );

    t.end();
});
