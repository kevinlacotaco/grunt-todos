'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.todos = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'TODO is low priority.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'TODO is med priority.');

    test.done();
  },
  verbose_false: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/verbose_false');
    var expected = grunt.file.read('test/expected/verbose_false');
    test.equal(actual, expected, 'Files without tasks should not print.');

    test.done();
  },
  custom_reporter: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_reporter');
    var expected = grunt.file.read('test/expected/custom_reporter');
    test.equal(actual, expected, 'Customer reporter should match expected value');

    test.done();
  }
};
