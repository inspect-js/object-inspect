var inspect = require('../');
var obj = {
    a: 1,
    b: [ 3, 4, undefined, null ],
    c: undefined,
    d: null,
    e: /^x/i,
    buf: new Buffer('abc'),
    now: new Date
};
obj.self = obj;
console.log(inspect(obj));
