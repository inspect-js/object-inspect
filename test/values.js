var inspect = require('../');
var test = require('tape');

test('values', function (t) {
    t.plan(1);
    var obj = [ {}, [] ];
    t.equal(inspect(obj), '[ {}, [] ]');
});
