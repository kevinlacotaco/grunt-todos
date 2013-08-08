/*
 * grunt-todos
 * https://github.com/kevinlacotaco/grunt-todos
 *
 * Copyright (c) 2013 Kevin Lakotko
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    todos: {
      default_options: {
        files: {
            'tmp/default_options' : ['test/fixtures/*.js']
        }
      },
      custom_options : {
        options : {
            priorities : {
                low : null,
                med : /(TODO|FIXME)/
            }
        },
        files: {
            'tmp/custom_options' : ['test/fixtures/*.js']
        }
      },
      verbose_false : {
        options : {
            verbose : false
        },
        files: {
            'tmp/verbose_false' : ['test/fixtures/*.js']
        }
      },
      console : {
        src : ['test/fixtures/*.js', 'test/fixtures/*.less']
      },
      console_verbose_false : {
        options : {
            verbose : false
        },
        src : ['test/fixtures/*.js']
      },
      custom_reporter : {
        options : {
          reporter : {
            header : function () { return '--header--\n'; },
            footer : function () { return '--footer--\n'; },
            fileTasks : function (file, tasks, options) {
              var result = '--file--' + file + '\n';
              tasks.forEach(function (task) {
                result += '-' + task.lineNumber + '-' + task.priority + '-' + task.line + '\n';
              });
              return result;
            }
          },
        },
        files: {
          'tmp/custom_reporter' : ['test/fixtures/*.js']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'todos', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
