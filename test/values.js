var inspect = require('../');
var test = require('tape');

test('values', function (t) {
    t.plan(1);
    var obj = [ {}, [], { 'a-b': 5 } ];
    t.equal(inspect(obj), '[ {}, [], { \'a-b\': 5 } ]');
});

test('has', function (t) {
    t.plan(1);
    var has = Object.prototype.hasOwnProperty;
    delete Object.prototype.hasOwnProperty;
    t.equal(inspect({ a: 1, b: 2 }), '{ a: 1, b: 2 }');
    Object.prototype.hasOwnProperty = has;
});
