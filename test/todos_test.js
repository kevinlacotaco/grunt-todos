'use strict';

var grunt = require('grunt');
var chai = require('chai');
var assert = chai.assert;

describe('options', function () {

    it('default', function () {
        var actual = grunt.file.read('tmp/default_options');
        var expected = grunt.file.read('test/expected/default_options');
        assert.strictEqual(actual, expected, 'TODO is low priority.');
    });

    it('custom', function () {
        var actual = grunt.file.read('tmp/custom_options');
        var expected = grunt.file.read('test/expected/custom_options');
        assert.strictEqual(actual, expected, 'TODO is med priority.');
    });

    it('verbose false', function () {
        var actual = grunt.file.read('tmp/verbose_false');
        var expected = grunt.file.read('test/expected/verbose_false');
        assert.strictEqual(actual, expected, 'Files without tasks should not print.');
    });
});

describe('reporters', function () {

    it('markdown reporter', function () {
        var actual = grunt.file.read('tmp/markdown.md');
        var expected = grunt.file.read('test/expected/markdown.md');
        assert.strictEqual(actual, expected, 'Markdown reporter should match expected value');
    });

    it('custom reporter', function () {
        var actual = grunt.file.read('tmp/custom_reporter');
        var expected = grunt.file.read('test/expected/custom_reporter');
        assert.strictEqual(actual, expected, 'Custom reporter should match expected value');
    });
});
