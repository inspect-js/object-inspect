'use strict';

var test = require('tape');
var forEach = require('for-each');

var inspect = require('../');

// expected outputs match node's `util.inspect` with the same `breakLength`, except for `Map (n) {...}`/`Set (n) {...}` formatting

test('bad breakLength options', function (t) {
    forEach([
        -1,
        -Infinity,
        1.5,
        NaN,
        'string',
        true,
        false,
        null,
        {},
        []
    ], function (breakLength) {
        t['throws'](
            function () { inspect('', { breakLength: breakLength }); },
            TypeError,
            inspect(breakLength) + ' is invalid'
        );
    });

    forEach([0, 1, 80, Infinity], function (breakLength) {
        t.doesNotThrow(
            function () { inspect('', { breakLength: breakLength }); },
            inspect(breakLength) + ' is valid'
        );
    });

    t.end();
});

test('breakLength threshold', function (t) {
    var obj = { a: 1, b: 2 };

    t.equal(inspect(obj, { breakLength: 23 }), '{ a: 1, b: 2 }', 'fits at the exact threshold');
    t.equal(
        inspect(obj, { breakLength: 22 }),
        [
            '{',
            '  a: 1,',
            '  b: 2',
            '}'
        ].join('\n'),
        'breaks one under the threshold'
    );

    t.equal(
        inspect({ a: { b: 1, c: 2 }, d: [1, 2] }, { breakLength: 20 }),
        [
            '{',
            '  a: {',
            '    b: 1,',
            '    c: 2',
            '  },',
            '  d: [ 1, 2 ]',
            '}'
        ].join('\n'),
        'indentation counts toward the threshold'
    );

    t.equal(
        inspect({ a: { b: 1 }, d: [1, 2] }, { breakLength: 0 }),
        [
            '{',
            '  a: {',
            '    b: 1',
            '  },',
            '  d: [',
            '    1,',
            '    2',
            '  ]',
            '}'
        ].join('\n'),
        '0 breaks everything'
    );

    t.end();
});

test('breakLength: Infinity', function (t) {
    t.equal(
        inspect({ a: { b: 1, c: 2 }, d: [1, 2] }, { breakLength: Infinity }),
        '{ a: { b: 1, c: 2 }, d: [ 1, 2 ] }',
        'nested objects fit on one line'
    );

    t.equal(
        inspect({ a: { b: { c: { d: 1 } } } }, { breakLength: Infinity }),
        [
            '{',
            '  a: { b: { c: { d: 1 } } }',
            '}'
        ].join('\n'),
        'an object with 3 levels nested below it breaks'
    );

    t.equal(
        inspect({ a: { b: { c: { d: 1 } } }, e: { f: 1 } }, { breakLength: Infinity }),
        '{ a: { b: { c: { d: 1 } } }, e: { f: 1 } }',
        'only the most recently entered nested object counts'
    );

    t.equal(
        inspect({ a: { b: { c: { d: 1 } } }, e: {}, g: [] }, { breakLength: Infinity }),
        [
            '{',
            '  a: { b: { c: { d: 1 } } },',
            '  e: {},',
            '  g: []',
            '}'
        ].join('\n'),
        'empty objects and arrays do not count as entered'
    );

    t.equal(
        inspect([1, 2, 3, 4, 5, 6, 7], { breakLength: Infinity }),
        [
            '[',
            '  1, 2, 3, 4,',
            '  5, 6, 7',
            ']'
        ].join('\n'),
        'arrays with more than 6 entries are still grouped'
    );

    t.end();
});

test('breakLength: indentation', function (t) {
    var obj = { a: { b: 1, c: 2 } };

    t.equal(
        inspect(obj, { breakLength: 15 }),
        [
            '{',
            '  a: {',
            '    b: 1,',
            '    c: 2',
            '  }',
            '}'
        ].join('\n'),
        'defaults to two spaces'
    );
    t.equal(inspect(obj, { breakLength: 15, indent: null }), inspect(obj, { breakLength: 15 }), '`indent: null` defaults to two spaces');

    t.equal(
        inspect(obj, { breakLength: 15, indent: 4 }),
        [
            '{',
            '    a: {',
            '        b: 1,',
            '        c: 2',
            '    }',
            '}'
        ].join('\n'),
        'uses a numeric indent'
    );

    t.equal(
        inspect(obj, { breakLength: 15, indent: '\t' }),
        [
            '{',
            '\ta: {',
            '\t\tb: 1,',
            '\t\tc: 2',
            '\t}',
            '}'
        ].join('\n'),
        'uses a tab indent'
    );

    t.end();
});

test('breakLength: array grouping', function (t) {
    var nums = [];
    for (var i = 0; i < 30; i++) {
        nums[nums.length] = i * 7;
    }
    t.equal(
        inspect(nums, { breakLength: 40 }),
        [
            '[',
            '    0,   7,  14,  21,  28,  35,  42,  49,',
            '   56,  63,  70,  77,  84,  91,  98, 105,',
            '  112, 119, 126, 133, 140, 147, 154, 161,',
            '  168, 175, 182, 189, 196, 203',
            ']'
        ].join('\n'),
        'numbers are grouped and aligned to the right'
    );

    t.equal(
        inspect(nums, { breakLength: 40, maxCollectionLength: 10 }),
        [
            '[',
            '   0,  7, 14, 21, 28,',
            '  35, 42, 49, 56, 63,',
            '  ... 20 more items',
            ']'
        ].join('\n'),
        'the "more items" entry is not grouped'
    );

    var strs = [];
    for (var j = 0; j < 20; j++) {
        strs[strs.length] = 'item' + j;
    }
    t.equal(
        inspect(strs, { breakLength: 60 }),
        [
            '[',
            "  'item0',  'item1',  'item2',",
            "  'item3',  'item4',  'item5',",
            "  'item6',  'item7',  'item8',",
            "  'item9',  'item10', 'item11',",
            "  'item12', 'item13', 'item14',",
            "  'item15', 'item16', 'item17',",
            "  'item18', 'item19'",
            ']'
        ].join('\n'),
        'non-numbers are grouped and aligned to the left'
    );

    t.equal(
        inspect([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }, { g: 7 }], { breakLength: 40 }),
        [
            '[',
            '  { a: 1 }, { b: 2 },',
            '  { c: 3 }, { d: 4 },',
            '  { e: 5 }, { f: 6 },',
            '  { g: 7 }',
            ']'
        ].join('\n'),
        'objects are grouped'
    );

    t.equal(
        inspect([1, 2, 3, 4, 5, 6], { breakLength: 20 }),
        [
            '[',
            '  1,',
            '  2,',
            '  3,',
            '  4,',
            '  5,',
            '  6',
            ']'
        ].join('\n'),
        'arrays with 6 or fewer entries are not grouped'
    );

    t.equal(
        inspect(['a', 'bb', 'a very long string entry here', 'c', 'd', 'e', 'f', 'g'], { breakLength: 80 }),
        "[ 'a', 'bb', 'a very long string entry here', 'c', 'd', 'e', 'f', 'g' ]",
        'entries of very different lengths are not grouped'
    );

    t.equal(
        inspect(['abcdefgh', 'abcdefgh', 'abcdefgh', 'abcdefgh', 'abcdefgh', 'abcdefgh', 'abcdefgh'], { breakLength: 80 }),
        [
            '[',
            "  'abcdefgh',",
            "  'abcdefgh',",
            "  'abcdefgh',",
            "  'abcdefgh',",
            "  'abcdefgh',",
            "  'abcdefgh',",
            "  'abcdefgh'",
            ']'
        ].join('\n'),
        'grouping that would yield one column does not group'
    );

    var withProps = [1, 2, 3, 4, 5, 6, 7, 8];
    withProps.foo = 'bar';
    t.equal(
        inspect(withProps, { breakLength: 30 }),
        [
            '[',
            '  1,',
            '  2,',
            '  3,',
            '  4,',
            '  5,',
            '  6,',
            '  7,',
            '  8,',
            "  foo: 'bar'",
            ']'
        ].join('\n'),
        'non-index properties count toward the entry lengths'
    );

    t.end();
});

test('breakLength: BigInt array grouping', { skip: typeof BigInt !== 'function' }, function (t) {
    t.equal(
        inspect([
            BigInt(1),
            BigInt(22),
            BigInt(333),
            BigInt(4444),
            BigInt(5),
            BigInt(6),
            BigInt(7)
        ], { breakLength: 30 }),
        [
            '[',
            '     1n, 22n, 333n,',
            '  4444n,  5n,   6n,',
            '     7n',
            ']'
        ].join('\n'),
        'BigInts are aligned to the right'
    );

    t.end();
});

test('breakLength: Map and Set', { skip: typeof Map !== 'function' || typeof Set !== 'function' }, function (t) {
    var map = new Map();
    map.set(1, { a: 1 });
    map.set('k', [1, 2, 3]);

    t.equal(inspect(map, { breakLength: 80 }), "Map (2) {1 => { a: 1 }, 'k' => [ 1, 2, 3 ]}", 'a Map that fits');
    t.equal(
        inspect(map, { breakLength: 20 }),
        [
            'Map (2) {',
            '  1 => { a: 1 },',
            "  'k' => [",
            '    1,',
            '    2,',
            '    3',
            '  ]',
            '}'
        ].join('\n'),
        'a Map that breaks'
    );

    var keyMap = new Map();
    keyMap.set({ aaaaaaaa: 1, bbbbbbbb: 2 }, 1);
    t.equal(
        inspect(keyMap, { breakLength: 20 }),
        [
            'Map (1) {',
            '  {',
            '    aaaaaaaa: 1,',
            '    bbbbbbbb: 2',
            '  } => 1',
            '}'
        ].join('\n'),
        'Map keys break too'
    );

    t.equal(
        inspect(new Set([1, 'two', { three: 3 }]), { breakLength: 20 }),
        [
            'Set (3) {',
            '  1,',
            "  'two',",
            '  {',
            '    three: 3',
            '  }',
            '}'
        ].join('\n'),
        'a Set that breaks'
    );

    t.equal(
        inspect({ a: { b: { c: { d: 1 } } }, e: new Map(), f: new Set() }, { breakLength: Infinity }),
        [
            '{',
            '  a: { b: { c: { d: 1 } } },',
            '  e: Map (0) {},',
            '  f: Set (0) {}',
            '}'
        ].join('\n'),
        'empty Maps and Sets do not count as entered'
    );

    t.end();
});

test('breakLength: functions and errors with properties', function (t) {
    function f() {}
    f.a = 1;
    t.equal(inspect(f, { breakLength: 80 }), '[Function: f] { a: 1 }', 'a function that fits');
    f.b = { c: 2 };
    t.equal(
        inspect(f, { breakLength: 20 }),
        [
            '[Function: f] {',
            '  a: 1,',
            '  b: { c: 2 }',
            '}'
        ].join('\n'),
        'a function that breaks'
    );

    var anonymous = [function () {}][0];
    anonymous.a = 1;
    t.equal(inspect(anonymous, { breakLength: 0 }), '[Function (anonymous)] {\n  a: 1\n}', 'an anonymous function that breaks');

    var err = new Error('x');
    err.code = 'E';
    t.equal(inspect(err, { breakLength: 80 }), "{ [Error: x] code: 'E' }", 'an error that fits');
    t.equal(
        inspect(err, { breakLength: 10 }),
        [
            '{ [Error: x]',
            "  code: 'E'",
            '}'
        ].join('\n'),
        'an error that breaks'
    );
    t.equal(inspect(new Error('y'), { breakLength: 0 }), '[Error: y]', 'an error without properties');

    t.end();
});

test('breakLength: entries containing newlines', function (t) {
    var expected = [
        '{',
        "  s: 'a",
        "b'",
        '}'
    ].join('\n');
    t.equal(inspect({ s: 'a\nb' }, { breakLength: 80, multilineStrings: true }), expected, 'breaks with a finite breakLength');
    t.equal(inspect({ s: 'a\nb' }, { breakLength: Infinity, multilineStrings: true }), expected, 'breaks with breakLength: Infinity');

    t.end();
});
