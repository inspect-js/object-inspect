'use strict';

/* global Float32Array, Uint8Array */

var test = require('tape');
var forEach = require('for-each');
var mockProperty = require('mock-property');
var requireStash = require('require-stash');
var hasToStringTag = require('has-tostringtag/shams')();

var inspect = require('../');

test('bad maxCollectionLength options', function (t) {
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
    ], function (maxCollectionLength) {
        t['throws'](
            function () { inspect('', { maxCollectionLength: maxCollectionLength }); },
            TypeError,
            inspect(maxCollectionLength) + ' is invalid'
        );
    });

    t.end();
});

test('valid maxCollectionLength options', function (t) {
    forEach([
        0,
        1,
        10,
        Infinity,
        null
    ], function (maxCollectionLength) {
        t.doesNotThrow(
            function () { inspect([], { maxCollectionLength: maxCollectionLength }); },
            inspect(maxCollectionLength) + ' is valid'
        );
    });

    t.end();
});

test('maxCollectionLength with arrays', function (t) {
    var arr = [1, 2, 3, 4, 5];

    t.equal(
        inspect(arr, { maxCollectionLength: 3 }),
        '[ 1, 2, 3, ... 2 more items ]',
        'array truncated at maxCollectionLength'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: 5 }),
        '[ 1, 2, 3, 4, 5 ]',
        'array not truncated when length equals maxCollectionLength'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: 10 }),
        '[ 1, 2, 3, 4, 5 ]',
        'array not truncated when maxCollectionLength exceeds length'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: 0 }),
        '[ ... 5 more items ]',
        'maxCollectionLength of 0 shows all as truncated'
    );

    t.equal(
        inspect([1], { maxCollectionLength: 0 }),
        '[ ... 1 more item ]',
        'singular item message when one item truncated'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: Infinity }),
        '[ 1, 2, 3, 4, 5 ]',
        'Infinity shows all elements'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: null }),
        '[ 1, 2, 3, 4, 5 ]',
        'null shows all elements (default behavior)'
    );

    t.end();
});

test('maxCollectionLength with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    map.set('d', 4);

    t.equal(
        inspect(map, { maxCollectionLength: 2 }),
        "Map (4) {'a' => 1, 'b' => 2, ... 2 more items}",
        'Map truncated at maxCollectionLength'
    );

    t.equal(
        inspect(map, { maxCollectionLength: 4 }),
        "Map (4) {'a' => 1, 'b' => 2, 'c' => 3, 'd' => 4}",
        'Map not truncated when length equals maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    set.add(4);

    t.equal(
        inspect(set, { maxCollectionLength: 2 }),
        'Set (4) {1, 2, ... 2 more items}',
        'Set truncated at maxCollectionLength'
    );

    t.equal(
        inspect(set, { maxCollectionLength: 4 }),
        'Set (4) {1, 2, 3, 4}',
        'Set not truncated when length equals maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength with nested arrays', function (t) {
    var arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    // maxCollectionLength applies to all arrays at all depths (like util.inspect)
    t.equal(
        inspect(arr, { maxCollectionLength: 2 }),
        '[ [ 1, 2, ... 1 more item ], [ 4, 5, ... 1 more item ], ... 1 more item ]',
        'maxCollectionLength applied recursively to nested arrays'
    );

    t.end();
});

test('maxCollectionLength with empty collections', function (t) {
    t.equal(
        inspect([], { maxCollectionLength: 0 }),
        '[]',
        'empty array with maxCollectionLength 0'
    );

    t.equal(
        inspect([], { maxCollectionLength: 5 }),
        '[]',
        'empty array with maxCollectionLength 5'
    );

    t.end();
});

test('maxCollectionLength with empty Map', { skip: typeof Map !== 'function' }, function (t) {
    var emptyMap = new Map();

    t.equal(
        inspect(emptyMap, { maxCollectionLength: 0 }),
        'Map (0) {}',
        'empty Map with maxCollectionLength 0'
    );

    t.end();
});

test('maxCollectionLength with empty Set', { skip: typeof Set !== 'function' }, function (t) {
    var emptySet = new Set();

    t.equal(
        inspect(emptySet, { maxCollectionLength: 0 }),
        'Set (0) {}',
        'empty Set with maxCollectionLength 0'
    );

    t.end();
});

test('maxCollectionLength of 1', function (t) {
    t.equal(
        inspect([1, 2, 3], { maxCollectionLength: 1 }),
        '[ 1, ... 2 more items ]',
        'array with maxCollectionLength 1'
    );

    t.equal(
        inspect([1], { maxCollectionLength: 1 }),
        '[ 1 ]',
        'single element array with maxCollectionLength 1'
    );

    t.end();
});

test('maxCollectionLength of 1 with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);

    t.equal(
        inspect(map, { maxCollectionLength: 1 }),
        "Map (2) {'a' => 1, ... 1 more item}",
        'Map with maxCollectionLength 1'
    );

    t.end();
});

test('maxCollectionLength of 1 with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set([1, 2]);

    t.equal(
        inspect(set, { maxCollectionLength: 1 }),
        'Set (2) {1, ... 1 more item}',
        'Set with maxCollectionLength 1'
    );

    t.end();
});

test('maxCollectionLength with sparse arrays', function (t) {
    var sparse = [1, , , 4, 5]; // eslint-disable-line no-sparse-arrays

    t.equal(
        inspect(sparse, { maxCollectionLength: 3 }),
        '[ 1, , , ... 2 more items ]',
        'sparse array truncated at maxCollectionLength'
    );

    t.equal(
        inspect(sparse, { maxCollectionLength: 2 }),
        '[ 1, , ... 3 more items ]',
        'sparse array with maxCollectionLength 2'
    );

    t.end();
});

test('maxCollectionLength with arrays containing undefined and null', function (t) {
    var arr = [undefined, null, 1, undefined, null];

    t.equal(
        inspect(arr, { maxCollectionLength: 3 }),
        '[ undefined, null, 1, ... 2 more items ]',
        'array with undefined/null truncated at maxCollectionLength'
    );

    t.equal(
        inspect(arr, { maxCollectionLength: 2 }),
        '[ undefined, null, ... 3 more items ]',
        'array with undefined/null at maxCollectionLength 2'
    );

    t.end();
});

test('maxCollectionLength with indent option', function (t) {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    var result = inspect(arr, { maxCollectionLength: 5, indent: 2 });
    t.ok(
        result.indexOf('... 5 more items') > -1,
        'truncation message present with indent'
    );

    // With enough items shown, indent should produce newlines
    var longArr = [];
    for (var i = 0; i < 20; i++) {
        longArr.push({ key: 'value' + i });
    }
    var longResult = inspect(longArr, { maxCollectionLength: 10, indent: 2 });
    t.ok(
        longResult.indexOf('\n') > -1,
        'newlines present with indent on complex array'
    );

    t.end();
});

test('maxCollectionLength with depth option', function (t) {
    var nested = { arr: [1, 2, 3, 4, 5] };

    t.equal(
        inspect(nested, { maxCollectionLength: 2, depth: 2 }),
        '{ arr: [ 1, 2, ... 3 more items ] }',
        'maxCollectionLength works with depth option'
    );

    // When depth is exceeded, array shows as [Array] regardless of maxCollectionLength
    t.equal(
        inspect(nested, { maxCollectionLength: 2, depth: 1 }),
        '{ arr: [Array] }',
        'depth limit shows [Array] regardless of maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength with large values', function (t) {
    var arr = [];
    for (var i = 0; i < 100; i++) {
        arr.push(i);
    }

    t.equal(
        inspect(arr, { maxCollectionLength: 1000 }),
        inspect(arr),
        'maxCollectionLength larger than array length shows all'
    );

    var result = inspect(arr, { maxCollectionLength: 5 });
    t.ok(
        result.indexOf('... 95 more items') > -1,
        'large array truncated correctly'
    );

    t.end();
});

test('maxCollectionLength with objects inside arrays', function (t) {
    var arr = [{ a: 1 }, { b: 2 }, { c: 3 }];

    t.equal(
        inspect(arr, { maxCollectionLength: 2 }),
        '[ { a: 1 }, { b: 2 }, ... 1 more item ]',
        'array of objects truncated at maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength with functions inside arrays', function (t) {
    function testFn() {}
    var arr = [testFn, testFn, testFn];

    t.equal(
        inspect(arr, { maxCollectionLength: 1 }),
        '[ [Function: testFn], ... 2 more items ]',
        'array of functions truncated at maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength does not affect non-array objects', function (t) {
    var obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

    t.equal(
        inspect(obj, { maxCollectionLength: 2 }),
        '{ a: 1, b: 2, c: 3, d: 4, e: 5 }',
        'maxCollectionLength does not affect plain objects'
    );

    t.end();
});

test('maxCollectionLength does not affect arguments objects', function (t) {
    var args = (function () { return arguments; }(1, 2, 3));

    t.equal(
        inspect(args, { maxCollectionLength: 1 }),
        inspect(args),
        'arguments objects are not truncated'
    );

    t.end();
});

test('maxCollectionLength with array non-index properties', function (t) {
    var arr = [1, 2, 3, 4];
    arr.foo = 'bar';

    t.equal(
        inspect(arr, { maxCollectionLength: 2 }),
        '[ 1, 2, ... 2 more items, foo: \'bar\' ]',
        'non-index properties follow the truncated elements'
    );

    t.end();
});

test('maxCollectionLength with Map keys', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set([1, 2, 3], 'a');

    t.equal(
        inspect(map, { maxCollectionLength: 1 }),
        'Map (1) {[ 1, ... 2 more items ] => \'a\'}',
        'Map keys are truncated'
    );

    t.end();
});

var hasTypedArrays = typeof Float32Array === 'function' && typeof Uint8Array === 'function';
// in node < 0.12, TypedArray instances have own enumerable members (eg, `length`, `buffer`, `subarray`)
var hasEnumerableTypedArrayMembers = hasTypedArrays && Object.prototype.propertyIsEnumerable.call(new Uint8Array(1), 'length');

function typedArrayPrefix(name) {
    return hasToStringTag ? name + ' [' + name + '] ' : name + ' ';
}

test('maxCollectionLength with TypedArrays', { skip: !hasTypedArrays || hasEnumerableTypedArrayMembers }, function (t) {
    var floats = new Float32Array([1, -0, 3, 4, 5]);
    var prefix = typedArrayPrefix('Float32Array');

    t.equal(
        inspect(floats, { maxCollectionLength: 2 }),
        prefix + '{ 0: 1, 1: -0, ... 3 more items }',
        'TypedArray truncated at maxCollectionLength'
    );

    t.equal(
        inspect(floats, { maxCollectionLength: 1 }),
        prefix + '{ 0: 1, ... 4 more items }',
        'TypedArray with maxCollectionLength 1'
    );

    t.equal(
        inspect(floats, { maxCollectionLength: 0 }),
        prefix + '{ ... 5 more items }',
        'TypedArray with maxCollectionLength 0'
    );

    t.equal(
        inspect(floats, { maxCollectionLength: 5 }),
        inspect(floats),
        'TypedArray not truncated when length equals maxCollectionLength'
    );

    t.equal(
        inspect(new Float32Array(0), { maxCollectionLength: 0 }),
        inspect(new Float32Array(0)),
        'empty TypedArray'
    );

    floats.foo = 'bar';
    t.equal(
        inspect(floats, { maxCollectionLength: 2 }),
        prefix + '{ 0: 1, 1: -0, ... 3 more items, foo: \'bar\' }',
        'non-index properties follow the truncated elements'
    );

    t.equal(
        inspect(new Uint8Array(1e7), { maxCollectionLength: 2 }),
        typedArrayPrefix('Uint8Array') + '{ 0: 0, 1: 0, ... 9999998 more items }',
        'large TypedArray is truncated'
    );

    t.test('own `length` property', { skip: !Object.defineProperty }, function (st) {
        var bytes = new Uint8Array(5);
        Object.defineProperty(bytes, 'length', { value: 99 });

        st.equal(
            inspect(bytes, { maxCollectionLength: 2 }),
            typedArrayPrefix('Uint8Array') + '{ 0: 0, 1: 0, ... 3 more items }',
            'the real length is used, not an own `length` property'
        );

        var shortBytes = new Uint8Array(5);
        Object.defineProperty(shortBytes, 'length', { value: 1 });

        st.equal(
            inspect(shortBytes, { maxCollectionLength: 2 }),
            typedArrayPrefix('Uint8Array') + '{ 0: 0, 1: 0, ... 3 more items }',
            'a smaller own `length` property does not prevent truncation'
        );

        st.end();
    });

    t.test('BigInt TypedArrays', { skip: typeof BigInt64Array !== 'function' }, function (st) {
        st.equal(
            inspect(new BigInt64Array(3), { maxCollectionLength: 2 }),
            typedArrayPrefix('BigInt64Array') + '{ 0: 0n, 1: 0n, ... 1 more item }',
            'BigInt TypedArray truncated at maxCollectionLength'
        );

        st.end();
    });

    t.test('Symbol.toStringTag', { skip: !hasToStringTag }, function (st) {
        var fake = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
        fake[Symbol.toStringTag] = 'Float32Array';

        st.equal(
            inspect(fake, { maxCollectionLength: 1 }),
            inspect(fake),
            'an object pretending to be a TypedArray is not truncated'
        );

        st.end();
    });

    t.end();
});

test('maxCollectionLength with TypedArrays that have enumerable members', { skip: !hasEnumerableTypedArrayMembers }, function (t) {
    var result = inspect(new Float32Array([1, 2, 3]), { maxCollectionLength: 1 });

    t.equal(
        result.slice(0, 'Float32Array { 0: 1, ... 2 more items, '.length),
        'Float32Array { 0: 1, ... 2 more items, ',
        'TypedArray elements are truncated, followed by its own members'
    );

    t.end();
});

test('maxCollectionLength with TypedArrays, without Symbol.toStringTag', { skip: typeof Float32Array !== 'function' || typeof Symbol !== 'function' }, function (t) {
    function FakeSymbol() {}
    FakeSymbol.iterator = function () {};

    var restoreSymbol = mockProperty(global, 'Symbol', { value: FakeSymbol });
    var restoreInspect = requireStash(__dirname, '../');
    var restoreUtilInspect = requireStash(__dirname, '../util.inspect');
    t.teardown(function () {
        restoreSymbol();
        restoreInspect();
        restoreUtilInspect();
    });

    var freshInspect = require('../'); // eslint-disable-line global-require

    t.equal(
        freshInspect(new Float32Array([1, 2, 3]), { maxCollectionLength: 1 }),
        'Float32Array { 0: 1, ... 2 more items }',
        'TypedArray truncated at maxCollectionLength'
    );

    t.equal(
        freshInspect({ 0: 1, 1: 2, length: 2 }, { maxCollectionLength: 1 }),
        '{ 0: 1, 1: 2, length: 2 }',
        'array-like object is not truncated'
    );

    t.end();
});

test('maxCollectionLength with Map and Set, without iterators', { skip: typeof Map !== 'function' || typeof Set !== 'function' }, function (t) {
    var restoreEntries = mockProperty(Map.prototype, 'entries', { 'delete': true });
    var restoreValues = mockProperty(Set.prototype, 'values', { 'delete': true });
    var restoreInspect = requireStash(__dirname, '../');
    t.teardown(function () {
        restoreEntries();
        restoreValues();
        restoreInspect();
    });

    var freshInspect = require('../'); // eslint-disable-line global-require

    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    t.equal(
        freshInspect(map, { maxCollectionLength: 2 }),
        'Map (3) {\'a\' => 1, \'b\' => 2, ... 1 more item}',
        'Map truncated at maxCollectionLength'
    );

    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    t.equal(
        freshInspect(set, { maxCollectionLength: 2 }),
        'Set (3) {1, 2, ... 1 more item}',
        'Set truncated at maxCollectionLength'
    );

    t.end();
});

test('maxCollectionLength, when unset, does not change output for collections modified during inspection', function (t) {
    var arr = [1];
    arr.push({ inspect: function () { arr.push(9); return 'X'; } });
    t.equal(inspect(arr), '[ 1, X, 9 ]', 'array grown during inspection');

    t.test('Maps and Sets', { skip: typeof Map !== 'function' || typeof Set !== 'function' }, function (st) {
        var map = new Map();
        map.set('a', { inspect: function () { map.set('b', 2); return 'X'; } });
        st.equal(inspect(map), 'Map (2) {\'a\' => X, \'b\' => 2}', 'Map grown during inspection');

        var set = new Set();
        set.add({ inspect: function () { set.add(2); return 'X'; } });
        st.equal(inspect(set), 'Set (2) {X, 2}', 'Set grown during inspection');

        st.end();
    });

    t.end();
});

test('maxCollectionLength with collections modified during inspection', { skip: typeof Map !== 'function' || typeof Set !== 'function' }, function (t) {
    var map = new Map();
    map.set('a', { inspect: function () { map['delete']('b'); map['delete']('c'); return 'X'; } });
    map.set('b', 1);
    map.set('c', 2);
    map.set('d', 3);
    t.equal(
        inspect(map, { maxCollectionLength: 2 }),
        'Map (2) {\'a\' => X, \'d\' => 3}',
        'Map entries deleted during inspection are not counted as remaining'
    );

    var set = new Set();
    set.add({ inspect: function () { set['delete'](2); set['delete'](3); return 'X'; } });
    set.add(2);
    set.add(3);
    set.add(4);
    t.equal(
        inspect(set, { maxCollectionLength: 2 }),
        'Set (2) {X, 4}',
        'Set entries deleted during inspection are not counted as remaining'
    );

    t.end();
});

test('maxCollectionLength with a modified iterator `next`', { skip: typeof Map !== 'function' || typeof Set !== 'function' || !Object.getPrototypeOf || typeof Map.prototype.entries !== 'function' }, function (t) {
    var MapIteratorPrototype = Object.getPrototypeOf(new Map().entries());
    var SetIteratorPrototype = Object.getPrototypeOf(new Set().values());
    var restoreMapNext = mockProperty(MapIteratorPrototype, 'next', { value: function () { throw new EvalError('should not be called'); } });
    var restoreSetNext = mockProperty(SetIteratorPrototype, 'next', { value: function () { throw new EvalError('should not be called'); } });
    t.teardown(function () {
        restoreMapNext();
        restoreSetNext();
    });

    var map = new Map();
    map.set(1, 1);
    map.set(2, 2);
    map.set(3, 3);
    t.equal(inspect(map, { maxCollectionLength: 2 }), 'Map (3) {1 => 1, 2 => 2, ... 1 more item}', 'Map');

    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    t.equal(inspect(set, { maxCollectionLength: 2 }), 'Set (3) {1, 2, ... 1 more item}', 'Set');

    t.end();
});

test('maxCollectionLength with TypedArrays, with per-type `length` getters', { skip: !hasTypedArrays || !Object.getPrototypeOf || !Object.getOwnPropertyDescriptor }, function (t) {
    var TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
    var lengthDescriptor = Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'length');

    t.test('engines with per-type getters', { skip: !lengthDescriptor || !lengthDescriptor.get || !lengthDescriptor.configurable }, function (st) {
        var restoreLength = mockProperty(TypedArrayPrototype, 'length', { 'delete': true });
        var restoreUint8Length = mockProperty(Uint8Array.prototype, 'length', { get: lengthDescriptor.get });
        var restoreInspect = requireStash(__dirname, '../');
        st.teardown(function () {
            restoreUint8Length();
            restoreLength();
            restoreInspect();
        });

        var freshInspect = require('../'); // eslint-disable-line global-require

        var bytes = new Uint8Array(5);
        Object.defineProperty(bytes, 'length', { value: 99 });
        st.equal(
            freshInspect(bytes, { maxCollectionLength: 2 }),
            typedArrayPrefix('Uint8Array') + '{ 0: 0, 1: 0, ... 3 more items }',
            'the per-type getter is used, not an own `length` property'
        );

        var floats = new Float32Array(3);
        st.equal(
            freshInspect(floats, { maxCollectionLength: 1 }),
            freshInspect(floats),
            'without a getter or a numeric `length`, the TypedArray is not truncated'
        );

        st.end();
    });

    t.end();
});
