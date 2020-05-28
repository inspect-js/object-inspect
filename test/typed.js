var inspect = require('../');
var test = require('tape');

test('prototype is Object.prototype', function (t) {
    t.plan(1);
    var obj = {};
    t.equal(inspect(obj), '{}');
});

test('prototype is null', function (t) {
    t.plan(1);
    var obj = Object.create(null);
    t.equal(inspect(obj), '{}');
});

test('prototype from new', function (t) {
    t.plan(1);
    function Foo() {}
    var obj = new Foo();
    t.equal(inspect(obj), 'Foo {}');
});
