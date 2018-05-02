var inspect = require('../');
var test = require('tape');

test('bigint', { skip: typeof BigInt === 'undefined' }, function (t) {
  t.plan(3);

  t.equal(inspect(BigInt(-256)), '-256n');
  t.equal(inspect(BigInt(0)), '0n');
  t.equal(inspect(BigInt(256)), '256n');
});
