var test = require('tape');
var hasSymbols = require('has-symbols')();
var utilInspect = require('../util.inspect');
var repeat = require('string.prototype.repeat');

var inspect = require('..');

test('inspect', function (t) {
    t.plan(3);
    var obj = [{ inspect: function () { return '!XYZ¡'; } }, []];
    t.equal(inspect(obj), '[ !XYZ¡, [] ]');
    t.equal(inspect(obj, { customInspect: true }), '[ !XYZ¡, [] ]');
    t.equal(inspect(obj, { customInspect: false }), '[ { inspect: [Function: inspect] }, [] ]');
});

test('inspect custom symbol', { skip: !hasSymbols || !utilInspect }, function (t) {
    t.plan(3);

    var obj = { inspect: function () { return 'string'; } };
    obj[utilInspect.custom] = function () { return 'symbol'; };

    t.equal(inspect([obj, []]), '[ ' + (utilInspect.custom ? 'symbol' : 'string') + ', [] ]');
    t.equal(inspect([obj, []], { customInspect: true }), '[ ' + (utilInspect.custom ? 'symbol' : 'string') + ', [] ]');
    t.equal(inspect([obj, []], { customInspect: false }), '[ { inspect: [Function: inspect] }, [] ]');
});

test('maxStringLength', function (t) {
    t.equal(
        inspect([repeat('a', 1e8)], { maxStringLength: 10 }),
        '[ \'aaaaaaaaaa\'... 99999990 more characters ]',
        'maxStringLength option limits output'
    );

    t.end();
});
