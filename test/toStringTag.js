'use strict';

var test = require('tape');
var hasSymbols = require('has-symbols')();

var inspect = require('..');

test('Symbol.toStringTag', { skip: !hasSymbols || typeof Symbol.toStringTag !== 'symbol' }, function (t) {
    t.plan(3);

    var obj = { a: 1 };
    obj[Symbol.toStringTag] = 'foo';
    t.equal(inspect(obj), '[foo] { a: 1 }', 'object with Symbol.toStringTag');

    t.test('null objects', { skip: 'toString' in { __proto__: null } }, function (st) {
        st.plan(2);

        var dict = { __proto__: null, a: 1 };
        st.equal(inspect(dict), '{ a: 1 }', 'null object with Symbol.toStringTag');

        dict[Symbol.toStringTag] = 'Dict';
        st.equal(inspect(dict), '[Dict] { a: 1 }', 'null object with Symbol.toStringTag');
    });

    t.test('instances', { todo: true }, function (st) {
        st.plan(2);

        function C() {
            this.a = 1;
        }
        st.equal(inspect(new C()), 'C { a: 1 }', 'instance, no toStringTag');

        C.prototype[Symbol.toStringTag] = 'Class!';
        st.equal(inspect(new C()), 'C [Class!] { a: 1 }', 'instance, with toStringTag');
    });
});
