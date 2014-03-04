var inspect = require('../');
var obj = { a: 1, b: [ 3, 4, undefined, null ], c: undefined, d: null };
obj.c = obj;
console.log(inspect(obj));
