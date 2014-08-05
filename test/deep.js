var inspect = require('../');
var test = require('tape');

test('deep', function (t) {
    t.plan(1);
    var obj = [ [ [ [ [ [ 500 ] ] ] ] ] ];
    t.equal(inspect(obj), '[ [ [ [ [ [Object] ] ] ] ] ]');
});
