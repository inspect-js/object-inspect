'use strict';

var inspect = require('util').inspect;
var Module = require('module');
var assign = require('object.assign');
var has = require('has');

var id = require.resolve('./');
var mod = new Module(id);
mod.exports = function (value, opts) {
    var options = assign({}, opts);
    if (has(options, 'quoteStyle') && options.quoteStyle !== 'single' && options.quoteStyle !== 'double') {
        throw new TypeError('invalid quote style');
    }
    if (inspect.custom && typeof value.inspect === 'function') {
        value[inspect.custom] = value.inspect;
        delete value.inspect;
    }
    return inspect(value, options)
        .replace(/\n/g, ' ') // util.inspect adds newlines
        .replace(/ +/g, ' ') // and indentation
        .replace( // known deviation for boxed primitives
            /^\[(?:BigInt|Number|Boolean|String|Symbol): ([^\]]+)\]$/,
            'Object($1)'
        )
        .replace(/^Object\(['"](.*)['"]\)$/, options.quoteStyle === 'double' ? 'Object("$1")' : "Object('$1')") // single-quotes boxed strings
        .replace(/^['"](.*)['"]$/, options.quoteStyle === 'double' ? '"$1"' : "'$1'") // single-quotes primitive strings
        .replace( // known deviation for Weak collection contents
            /^(WeakMap|WeakSet) { <items unknown> }$/,
            '$1 { ? }'
        )
        .replace( // known deviation for collection spacing
            /(Map|Set)\((\d+)\) \{\s*(\S.*\S)?\s*\}/g,
            '$1 ($2) {$3}'
        )
        .replace(
            /<(\d+) empty items?>/g,
            function (_, count) {
                return (Array.from({ length: count - 1 }, function () { return ','; }).join(' ') + ' ').trim();
            }
        )
        .replace(/,,/g, ', ,')
        .replace(
            /\\u00/g,
            '\\x'
        )
};
require.cache[id] = mod;

// this is because text expectations use `String(date)`, we use toString, but util uses toISOString
var orig = Date.prototype.toString;
Date.prototype.toString = function () {
    var inTests = new Error().stack.split('\n').slice(1).filter(x => x.indexOf('(<anonymous>)') === -1).some(x => x.indexOf(__dirname + '/test/values.js') > -1);
    if (inTests) {
        return Date.prototype.toISOString.apply(this, arguments);
    }
    return orig.apply(this, arguments);
};

// node 11+ no longer calls a string "inspect" method
if (Object.defineProperty && inspect.custom) {
    Object.defineProperty(
        Object.prototype,
        inspect.custom,
        {
            get: function () {
                if (typeof this.inspect === 'function') {
                    return this.inspect;
                }
            },
            set: function (v) {
                Object.defineProperty(this, inspect.custom, {
                    enumerable: true,
                    configurable: true,
                    value: v,
                    writable: true
                });
            }
        }
    );
}
