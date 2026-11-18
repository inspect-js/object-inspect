'use strict';

var test = require('tape');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var generated = fs.readFileSync(path.join(__dirname, '..', 'stringWidthRanges.js'), 'utf8');
var unicodeVersion = generated.match(/for Unicode ([0-9.]+)\./)[1];

test('stringWidthRanges.js is up to date', { skip: process.versions.unicode !== unicodeVersion || !process.versions.icu }, function (t) {
    var output = childProcess.execFileSync(
        process.execPath,
        [
            '--expose-internals',
            path.join(__dirname, '..', 'scripts', 'generate-string-width-ranges.js'),
            '--stdout'
        ],
        { encoding: 'utf8' }
    );

    t.equal(output, generated, '`npm run generate:string-width` produces no diff, with Unicode ' + unicodeVersion);

    t.end();
});
