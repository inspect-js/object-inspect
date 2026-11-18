'use strict';

var test = require('tape');
var vm = require('vm');

var inspect = require('../');

var hasProtoLiteral = !('toString' in { __proto__: null });

test('objects from another realm', { skip: typeof vm.runInNewContext !== 'function' }, function (t) {
    t.equal(
        inspect(vm.runInNewContext('({ a: 1 })')),
        'Object { a: 1 }',
        'plain object from another realm is not reported as having a null prototype'
    );

    t.equal(
        inspect(vm.runInNewContext('function Foo() { this.a = 1; } new Foo()')),
        'Foo { a: 1 }',
        'instance from another realm is not reported as having a null prototype'
    );

    t.equal(
        inspect(vm.runInNewContext('[1, { b: 2 }]')),
        '[ 1, Object { b: 2 } ]',
        'nested object from another realm is not reported as having a null prototype'
    );

    t.test('null objects', { skip: !hasProtoLiteral }, function (st) {
        st.equal(
            inspect(vm.runInNewContext('({ __proto__: null, a: 1 })')),
            '[Object: null prototype] { a: 1 }',
            'null object from another realm'
        );

        st.end();
    });

    t.end();
});

test('null prototype only describes the immediate prototype', { skip: !hasProtoLiteral }, function (t) {
    function Foo() {}
    Foo.prototype = { __proto__: null, constructor: Foo };

    t.equal(inspect(new Foo()), 'Foo {}', 'instance whose prototype has a null prototype');

    t.equal(
        inspect({ __proto__: { __proto__: null } }),
        '{}',
        'object whose prototype has a null prototype'
    );

    t.end();
});
