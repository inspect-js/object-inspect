'use strict';

var test = require('tape');
var mockProperty = require('mock-property');
var requireStash = require('require-stash');

var getStringWidth = require('../stringWidth');

// expected widths match node's ICU-based `getStringWidth`
test('getStringWidth', function (t) {
    t.equal(getStringWidth(''), 0, 'empty string');
    t.equal(getStringWidth('abc'), 3, 'ASCII');
    t.equal(getStringWidth('a\tb\x7F'), 2, 'control characters are zero width');
    t.equal(getStringWidth('\u4e2d\u6587'), 4, 'CJK characters are full width');
    t.equal(getStringWidth('abc\u4e2d'), 5, 'ASCII then CJK');
    t.equal(getStringWidth('\u00e9'), 1, 'a precomposed accented letter');
    t.equal(getStringWidth('e\u0301'), 1, 'a combining mark is zero width');
    t.equal(getStringWidth('\u00ad'), 1, 'a soft hyphen is not zero width');
    t.equal(getStringWidth('\uD83D\uDC4D'), 2, 'an emoji is full width');
    t.equal(getStringWidth('\uD83D\uDC4D\uD83C\uDFFD'), 4, 'emoji modifiers are counted');
    t.equal(getStringWidth('\uD83D\uDC68\u200d\uD83D\uDC69'), 4, 'emoji sequences are counted per code point');
    t.equal(getStringWidth('\uD800'), 1, 'a lone high surrogate');
    t.equal(getStringWidth('a\uD800b'), 3, 'a lone high surrogate before an ASCII character');
    t.equal(getStringWidth('a\uDC00b'), 3, 'a lone low surrogate');
    t.equal(getStringWidth('a\uD834\uDD5E'), 3, 'an astral code point that decomposes');

    t.end();
});

var canNormalize = typeof String.prototype.normalize === 'function' && '\u1100\u1161'.normalize('NFC') === '\uac00';

test('getStringWidth: normalization', { skip: !canNormalize }, function (t) {
    t.equal(getStringWidth('x\u1100\u1161\u11a8'), 3, 'Hangul jamo compose into one full width syllable');

    t.end();
});

test('getStringWidth: without String.prototype.normalize', function (t) {
    var restoreNormalize = mockProperty(String.prototype, 'normalize', { 'delete': true });
    var restoreStringWidth = requireStash(__dirname, '../stringWidth');
    t.teardown(function () {
        restoreNormalize();
        restoreStringWidth();
    });

    var freshGetStringWidth = require('../stringWidth'); // eslint-disable-line global-require

    t.equal(freshGetStringWidth('x\u1100\u1161\u11a8'), 5, 'Hangul jamo are counted separately');
    t.equal(freshGetStringWidth('\u4e2d'), 2, 'CJK characters are still full width');

    t.end();
});
