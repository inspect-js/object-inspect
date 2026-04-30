var test = require('tape');
var forEach = require('for-each');

var inspect = require('../');

test('bad indent options', function (t) {
    forEach([
        undefined,
        true,
        false,
        -1,
        1.2,
        Infinity,
        -Infinity,
        NaN
    ], function (indent) {
        t['throws'](
            function () { inspect('', { indent: indent }); },
            TypeError,
            inspect(indent) + ' is invalid'
        );
    });

    t.end();
});

test('simple object with indent', function (t) {
    t.plan(2);

    var obj = { a: 1, b: 2 };

    var expectedSpaces = [
        '{',
        '  a: 1,',
        '  b: 2',
        '}'
    ].join('\n');
    var expectedTabs = [
        '{',
        '	a: 1,',
        '	b: 2',
        '}'
    ].join('\n');

    t.equal(inspect(obj, { indent: 2 }), expectedSpaces, 'two');
    t.equal(inspect(obj, { indent: '\t' }), expectedTabs, 'tabs');
});

test('two deep object with indent', function (t) {
    t.plan(2);

    var obj = { a: 1, b: { c: 3, d: 4 } };

    var expectedSpaces = [
        '{',
        '  a: 1,',
        '  b: {',
        '    c: 3,',
        '    d: 4',
        '  }',
        '}'
    ].join('\n');
    var expectedTabs = [
        '{',
        '	a: 1,',
        '	b: {',
        '		c: 3,',
        '		d: 4',
        '	}',
        '}'
    ].join('\n');

    t.equal(inspect(obj, { indent: 2 }), expectedSpaces, 'two');
    t.equal(inspect(obj, { indent: '\t' }), expectedTabs, 'tabs');
});

test('simple array with all single line elements', function (t) {
    t.plan(2);

    var obj = [1, 2, 3, 'asdf\nsdf'];

    var expected = '[ 1, 2, 3, \'asdf\\nsdf\' ]';

    t.equal(inspect(obj, { indent: 2 }), expected, 'two');
    t.equal(inspect(obj, { indent: '\t' }), expected, 'tabs');
});

test('array with complex elements', function (t) {
    t.plan(2);

    var obj = [1, { a: 1, b: { c: 1 } }, 'asdf\nsdf'];

    var expectedSpaces = [
        '[',
        '  1,',
        '  {',
        '    a: 1,',
        '    b: {',
        '      c: 1',
        '    }',
        '  },',
        '  \'asdf\\nsdf\'',
        ']'
    ].join('\n');
    var expectedTabs = [
        '[',
        '	1,',
        '	{',
        '		a: 1,',
        '		b: {',
        '			c: 1',
        '		}',
        '	},',
        '	\'asdf\\nsdf\'',
        ']'
    ].join('\n');

    t.equal(inspect(obj, { indent: 2 }), expectedSpaces, 'two');
    t.equal(inspect(obj, { indent: '\t' }), expectedTabs, 'tabs');
});

test('values', function (t) {
    t.plan(2);
    var obj = [{}, [], { 'a-b': 5 }];

    var expectedSpaces = [
        '[',
        '  {},',
        '  [],',
        '  {',
        '    \'a-b\': 5',
        '  }',
        ']'
    ].join('\n');
    var expectedTabs = [
        '[',
        '	{},',
        '	[],',
        '	{',
        '		\'a-b\': 5',
        '	}',
        ']'
    ].join('\n');

    t.equal(inspect(obj, { indent: 2 }), expectedSpaces, 'two');
    t.equal(inspect(obj, { indent: '\t' }), expectedTabs, 'tabs');
});

test('Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set({ a: 1 }, ['b']);
    map.set(3, NaN);

    var expectedStringSpaces = [
        'Map (2) {',
        '  { a: 1 } => [ \'b\' ],',
        '  3 => NaN',
        '}'
    ].join('\n');
    var expectedStringTabs = [
        'Map (2) {',
        '	{ a: 1 } => [ \'b\' ],',
        '	3 => NaN',
        '}'
    ].join('\n');
    var expectedStringTabsDoubleQuotes = [
        'Map (2) {',
        '	{ a: 1 } => [ "b" ],',
        '	3 => NaN',
        '}'
    ].join('\n');

    t.equal(
        inspect(map, { indent: 2 }),
        expectedStringSpaces,
        'Map keys are not indented (two)'
    );
    t.equal(
        inspect(map, { indent: '\t' }),
        expectedStringTabs,
        'Map keys are not indented (tabs)'
    );
    t.equal(
        inspect(map, { indent: '\t', quoteStyle: 'double' }),
        expectedStringTabsDoubleQuotes,
        'Map keys are not indented (tabs + double quotes)'
    );

    t.equal(inspect(new Map(), { indent: 2 }), 'Map (0) {}', 'empty Map should show as empty (two)');
    t.equal(inspect(new Map(), { indent: '\t' }), 'Map (0) {}', 'empty Map should show as empty (tabs)');

    var nestedMap = new Map();
    nestedMap.set(nestedMap, map);
    var expectedNestedSpaces = [
        'Map (1) {',
        '  [Circular] => Map (2) {',
        '    { a: 1 } => [ \'b\' ],',
        '    3 => NaN',
        '  }',
        '}'
    ].join('\n');
    var expectedNestedTabs = [
        'Map (1) {',
        '	[Circular] => Map (2) {',
        '		{ a: 1 } => [ \'b\' ],',
        '		3 => NaN',
        '	}',
        '}'
    ].join('\n');
    t.equal(inspect(nestedMap, { indent: 2 }), expectedNestedSpaces, 'Map containing a Map should work (two)');
    t.equal(inspect(nestedMap, { indent: '\t' }), expectedNestedTabs, 'Map containing a Map should work (tabs)');

    t.end();
});

test('Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set();
    set.add({ a: 1 });
    set.add(['b']);
    var expectedStringSpaces = [
        'Set (2) {',
        '  {',
        '    a: 1',
        '  },',
        '  [ \'b\' ]',
        '}'
    ].join('\n');
    var expectedStringTabs = [
        'Set (2) {',
        '	{',
        '		a: 1',
        '	},',
        '	[ \'b\' ]',
        '}'
    ].join('\n');
    t.equal(inspect(set, { indent: 2 }), expectedStringSpaces, 'new Set([{ a: 1 }, ["b"]]) should show size and contents (two)');
    t.equal(inspect(set, { indent: '\t' }), expectedStringTabs, 'new Set([{ a: 1 }, ["b"]]) should show size and contents (tabs)');

    t.equal(inspect(new Set(), { indent: 2 }), 'Set (0) {}', 'empty Set should show as empty (two)');
    t.equal(inspect(new Set(), { indent: '\t' }), 'Set (0) {}', 'empty Set should show as empty (tabs)');

    var nestedSet = new Set();
    nestedSet.add(set);
    nestedSet.add(nestedSet);
    var expectedNestedSpaces = [
        'Set (2) {',
        '  Set (2) {',
        '    {',
        '      a: 1',
        '    },',
        '    [ \'b\' ]',
        '  },',
        '  [Circular]',
        '}'
    ].join('\n');
    var expectedNestedTabs = [
        'Set (2) {',
        '	Set (2) {',
        '		{',
        '			a: 1',
        '		},',
        '		[ \'b\' ]',
        '	},',
        '	[Circular]',
        '}'
    ].join('\n');
    t.equal(inspect(nestedSet, { indent: 2 }), expectedNestedSpaces, 'Set containing a Set should work (two)');
    t.equal(inspect(nestedSet, { indent: '\t' }), expectedNestedTabs, 'Set containing a Set should work (tabs)');

    t.end();
});

test('bad breakLength options', function (t) {
    forEach([
        -1,
        1.5,
        NaN,
        'string',
        true,
        false,
        {},
        []
    ], function (breakLength) {
        t['throws'](
            function () { inspect('', { breakLength: breakLength }); },
            TypeError,
            inspect(breakLength) + ' is invalid for breakLength'
        );
    });

    t.end();
});

test('breakLength: Infinity forces single-line output', function (t) {
    var obj = { a: 1, b: { c: 3, d: 4 } };

    // With indent but without breakLength: Infinity, output is multi-line
    var multiLine = inspect(obj, { indent: 2 });
    t.ok(multiLine.indexOf('\n') >= 0, 'without breakLength: Infinity, output is multi-line');

    // With indent AND breakLength: Infinity, output is single-line
    var singleLine = inspect(obj, { indent: 2, breakLength: Infinity });
    t.equal(singleLine.indexOf('\n'), -1, 'with breakLength: Infinity, output is single-line');
    t.equal(singleLine, '{ a: 1, b: { c: 3, d: 4 } }', 'single-line output matches expected format');

    t.end();
});

test('breakLength: Infinity with arrays', function (t) {
    var obj = [1, { a: 1, b: { c: 1 } }, 'test'];

    // With breakLength: Infinity, arrays with complex elements are still single-line
    var singleLine = inspect(obj, { indent: 2, breakLength: Infinity });
    t.equal(singleLine.indexOf('\n'), -1, 'array with complex elements is single-line with breakLength: Infinity');
    t.equal(singleLine, "[ 1, { a: 1, b: { c: 1 } }, 'test' ]", 'array single-line output matches expected format');

    t.end();
});

test('breakLength: Infinity with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set({ a: 1 }, ['b']);
    map.set(3, NaN);

    var singleLine = inspect(map, { indent: 2, breakLength: Infinity });
    t.equal(singleLine.indexOf('\n'), -1, 'Map is single-line with breakLength: Infinity');
    t.equal(singleLine, "Map (2) {{ a: 1 } => [ 'b' ], 3 => NaN}", 'Map single-line output matches expected format');

    t.end();
});

test('breakLength: Infinity with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set();
    set.add({ a: 1 });
    set.add(['b']);

    var singleLine = inspect(set, { indent: 2, breakLength: Infinity });
    t.equal(singleLine.indexOf('\n'), -1, 'Set is single-line with breakLength: Infinity');
    t.equal(singleLine, "Set (2) {{ a: 1 }, [ 'b' ]}", 'Set single-line output matches expected format');

    t.end();
});

test('finite breakLength values are accepted', function (t) {
    var obj = { a: 1, b: { c: 3, d: 4 } };

    // breakLength: 0 is valid (means always break)
    t.doesNotThrow(
        function () { inspect(obj, { breakLength: 0 }); },
        'breakLength: 0 is valid'
    );

    // breakLength: 80 (default) is valid
    t.doesNotThrow(
        function () { inspect(obj, { breakLength: 80 }); },
        'breakLength: 80 is valid'
    );

    // breakLength: 120 is valid
    t.doesNotThrow(
        function () { inspect(obj, { breakLength: 120 }); },
        'breakLength: 120 is valid'
    );

    t.end();
});

test('finite breakLength controls single-line vs multi-line', function (t) {
    var obj = { a: 1, b: { c: 3, d: 4 } };
    // single-line form: '{ a: 1, b: { c: 3, d: 4 } }' = 27 chars

    var expectedMultiLine = [
        '{',
        '  a: 1,',
        '  b: {',
        '    c: 3,',
        '    d: 4',
        '  }',
        '}'
    ].join('\n');

    // breakLength: 0 → always multi-line
    t.equal(
        inspect(obj, { indent: 2, breakLength: 0 }),
        expectedMultiLine,
        'breakLength: 0 with indent produces multi-line output'
    );

    // breakLength: 1 → always multi-line (everything exceeds 1)
    t.equal(
        inspect(obj, { indent: 2, breakLength: 1 }),
        expectedMultiLine,
        'breakLength: 1 with indent produces multi-line output'
    );

    // breakLength: 26 → outer multi-line (27 > 26), inner stays single-line (15 <= 26)
    var expectedPartialBreak = [
        '{',
        '  a: 1,',
        '  b: { c: 3, d: 4 }',
        '}'
    ].join('\n');
    t.equal(
        inspect(obj, { indent: 2, breakLength: 26 }),
        expectedPartialBreak,
        'breakLength below outer length breaks outer but keeps inner single-line'
    );

    // breakLength: 27 → single-line (27 is not > 27)
    t.equal(
        inspect(obj, { indent: 2, breakLength: 27 }),
        '{ a: 1, b: { c: 3, d: 4 } }',
        'breakLength at single-line length produces single-line output'
    );

    // breakLength: 80 → single-line (27 <= 80)
    t.equal(
        inspect(obj, { indent: 2, breakLength: 80 }),
        '{ a: 1, b: { c: 3, d: 4 } }',
        'breakLength: 80 with short object produces single-line output'
    );

    // breakLength: Infinity → always single-line
    t.equal(
        inspect(obj, { indent: 2, breakLength: Infinity }),
        '{ a: 1, b: { c: 3, d: 4 } }',
        'breakLength: Infinity with indent produces single-line output'
    );

    t.end();
});

test('finite breakLength with arrays', function (t) {
    var arr = [1, 2, 3, 4, 5];
    // single-line form: '[ 1, 2, 3, 4, 5 ]' = 17 chars

    // breakLength: 0 → always multi-line
    var expectedMultiLine = [
        '[',
        '  1,',
        '  2,',
        '  3,',
        '  4,',
        '  5',
        ']'
    ].join('\n');
    t.equal(
        inspect(arr, { indent: 2, breakLength: 0 }),
        expectedMultiLine,
        'breakLength: 0 with array produces multi-line output'
    );

    // breakLength: 16 → multi-line (17 > 16)
    t.equal(
        inspect(arr, { indent: 2, breakLength: 16 }),
        expectedMultiLine,
        'breakLength below array length produces multi-line output'
    );

    // breakLength: 17 → single-line (17 is not > 17)
    t.equal(
        inspect(arr, { indent: 2, breakLength: 17 }),
        '[ 1, 2, 3, 4, 5 ]',
        'breakLength at array length produces single-line output'
    );

    // breakLength: Infinity → single-line
    t.equal(
        inspect(arr, { indent: 2, breakLength: Infinity }),
        '[ 1, 2, 3, 4, 5 ]',
        'breakLength: Infinity with array produces single-line output'
    );

    t.end();
});

test('finite breakLength with Map', { skip: typeof Map !== 'function' }, function (t) {
    var map = new Map();
    map.set('x', 1);
    map.set('y', 2);
    // single-line form: "Map (2) {'x' => 1, 'y' => 2}" = 28 chars

    var expectedMultiLine = [
        'Map (2) {',
        "  'x' => 1,",
        "  'y' => 2",
        '}'
    ].join('\n');

    // breakLength: 0 → multi-line
    t.equal(
        inspect(map, { indent: 2, breakLength: 0 }),
        expectedMultiLine,
        'breakLength: 0 with Map produces multi-line output'
    );

    // breakLength: 27 → multi-line (28 > 27)
    t.equal(
        inspect(map, { indent: 2, breakLength: 27 }),
        expectedMultiLine,
        'breakLength below Map length produces multi-line output'
    );

    // breakLength: 28 → single-line (28 is not > 28)
    t.equal(
        inspect(map, { indent: 2, breakLength: 28 }),
        "Map (2) {'x' => 1, 'y' => 2}",
        'breakLength at Map length produces single-line output'
    );

    // breakLength: Infinity → single-line
    t.equal(
        inspect(map, { indent: 2, breakLength: Infinity }),
        "Map (2) {'x' => 1, 'y' => 2}",
        'breakLength: Infinity with Map produces single-line output'
    );

    t.end();
});

test('finite breakLength with Set', { skip: typeof Set !== 'function' }, function (t) {
    var set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    // single-line form: "Set (3) {1, 2, 3}" = 17 chars

    var expectedMultiLine = [
        'Set (3) {',
        '  1,',
        '  2,',
        '  3',
        '}'
    ].join('\n');

    // breakLength: 0 → multi-line
    t.equal(
        inspect(set, { indent: 2, breakLength: 0 }),
        expectedMultiLine,
        'breakLength: 0 with Set produces multi-line output'
    );

    // breakLength: 16 → multi-line (17 > 16)
    t.equal(
        inspect(set, { indent: 2, breakLength: 16 }),
        expectedMultiLine,
        'breakLength below Set length produces multi-line output'
    );

    // breakLength: 17 → single-line (17 is not > 17)
    t.equal(
        inspect(set, { indent: 2, breakLength: 17 }),
        'Set (3) {1, 2, 3}',
        'breakLength at Set length produces single-line output'
    );

    // breakLength: Infinity → single-line
    t.equal(
        inspect(set, { indent: 2, breakLength: Infinity }),
        'Set (3) {1, 2, 3}',
        'breakLength: Infinity with Set produces single-line output'
    );

    t.end();
});

test('breakLength without indent has no effect', function (t) {
    var obj = { a: 1, b: 2, c: 3 };

    // Without indent, breakLength has no effect (can not break into multi-line)
    t.equal(
        inspect(obj, { breakLength: 0 }),
        '{ a: 1, b: 2, c: 3 }',
        'breakLength: 0 without indent stays single-line'
    );

    t.equal(
        inspect(obj, { breakLength: 1 }),
        '{ a: 1, b: 2, c: 3 }',
        'breakLength: 1 without indent stays single-line'
    );

    t.end();
});

test('breakLength with nested objects at different thresholds', function (t) {
    var obj = { a: { b: 1 }, c: 2 };
    /* single-line: '{ a: { b: 1 }, c: 2 }' = 22 chars, inner '{ b: 1 }' = 8 chars */

    // breakLength: 30 → everything single-line
    t.equal(
        inspect(obj, { indent: 2, breakLength: 30 }),
        '{ a: { b: 1 }, c: 2 }',
        'breakLength: 30, all fits single-line'
    );

    // breakLength: 10 → outer multi-line, inner stays single-line (8 <= 10)
    var expected = [
        '{',
        '  a: { b: 1 },',
        '  c: 2',
        '}'
    ].join('\n');
    t.equal(
        inspect(obj, { indent: 2, breakLength: 10 }),
        expected,
        'breakLength: 10, outer breaks but inner fits'
    );

    // breakLength: 5 → both break
    var expectedDeep = [
        '{',
        '  a: {',
        '    b: 1',
        '  },',
        '  c: 2',
        '}'
    ].join('\n');
    t.equal(
        inspect(obj, { indent: 2, breakLength: 5 }),
        expectedDeep,
        'breakLength: 5, both outer and inner break'
    );

    t.end();
});

test('backward compat: indent without breakLength preserves old behavior', function (t) {
    // Without breakLength, objects always go multi-line with indent
    var obj = { a: 1 };
    var expected = [
        '{',
        '  a: 1',
        '}'
    ].join('\n');
    t.equal(
        inspect(obj, { indent: 2 }),
        expected,
        'small object with indent (no breakLength) is multi-line'
    );

    // Without breakLength, arrays stay single-line (original behavior)
    var arr = [1, 2, 3];
    t.equal(
        inspect(arr, { indent: 2 }),
        '[ 1, 2, 3 ]',
        'simple array with indent (no breakLength) stays single-line'
    );

    t.end();
});
