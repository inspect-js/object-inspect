'use strict';

var inspect = require('../');
var test = require('tape');
var forEach = require('for-each');
var v = require('es-value-fixtures');

test('multilineStrings option', function (t) {
    forEach(v.nonBooleans, function (nonBoolean) {
        t['throws'](
            function () { inspect('a', { multilineStrings: nonBoolean }); },
            TypeError,
            inspect(nonBoolean) + ' is not a boolean'
        );
    });

    var str = 'line one\nline two\r\nline\tthree';

    t.equal(inspect(str), '\'line one\\nline two\\r\\nline\\tthree\'', 'newlines are escaped by default');
    t.equal(inspect(str, { multilineStrings: false }), '\'line one\\nline two\\r\\nline\\tthree\'', 'newlines are escaped when `false`');
    t.equal(
        inspect(str, { multilineStrings: true }),
        '\'line one\nline two\\r\nline\\tthree\'',
        'newlines are line breaks when `true`; other control characters are still escaped'
    );
    t.equal(
        inspect(str, { multilineStrings: true, quoteStyle: 'double' }),
        '"line one\nline two\\r\nline\\tthree"',
        'works with `quoteStyle`'
    );
    t.equal(
        inspect([str], { multilineStrings: true }),
        '[ \'line one\nline two\\r\nline\\tthree\' ]',
        'applies to nested strings'
    );
    t.equal(
        inspect('a\nbcdef', { multilineStrings: true, maxStringLength: 3 }),
        '\'a\nb\'... 4 more characters',
        'works with `maxStringLength`'
    );

    t.end();
});
