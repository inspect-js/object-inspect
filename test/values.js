var inspect = require('../');
var test = require('tape');

test('values', function (t) {
    t.plan(1);
    var obj = [ {}, [], { 'a-b': 5 } ];
    t.equal(inspect(obj), '[ {}, [], { \'a-b\': 5 } ]');
});
