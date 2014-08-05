var inspect = require('../');
var test = require('tape');

test('element', function (t) {
    t.plan(1);
    var elem = {
        nodeName: 'div',
        attributes: [ { name: 'class', value: 'row' } ],
        getAttribute: function (key) {
            return elem.attributes[key];
        },
        childNodes: []
    };
    var obj = [ 1, elem, 3 ];
    t.deepEqual(inspect(obj), '[ 1, <div class="row"></div>, 3 ]');
});
