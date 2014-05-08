/*
 * grunt-todos
 * https://github.com/kevinlacotaco/grunt-todos
 *
 * Copyright (c) 2013 Kevin Lakotko
 * Licensed under the MIT license.
 */

'use strict';

/*jshint -W098*/

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'test/*_test.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            tests: ['tmp']
        },
        todos: {
            default_options: {
                files: {
                    'tmp/default_options': ['test/fixtures/*.js']
                }
            },
            custom_options: {
                options: {
                    priorities: {
                        low: null,
                        med: /(TODO|FIXME)/
                    }
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/*.js']
                }
            },
            verbose_false: {
                options: {
                    verbose: false
                },
                files: {
                    'tmp/verbose_false': ['test/fixtures/*.js']
                }
            },
            console: {
                src: ['test/fixtures/*.js', 'test/fixtures/*.less']
            },
            console_verbose_false: {
                options: {
                    verbose: false
                },
                src: ['test/fixtures/*.js']
            },
            high_priority: {
                options: {
                    priorities: {
                        low: null,
                        med: /(TODO)/,
                        high: /(FIXME)/
                    }
                },
                src: ['test/fixtures/*']
            },
            custom_reporter: {
                options: {
                    reporter: {
                        header: function () {
                            return '--header--\n';
                        },
                        footer: function () {
                            return '--footer--\n';
                        },
                        fileTasks: function (file, tasks, options) {
                            var result = '--file--' + file + '\n';
                            tasks.forEach(function (task) {
                                result += '-' + task.lineNumber + '-' + task.priority + '-' + task.line + '\n';
                            });
                            return result;
                        }
                    }
                },
                files: {
                    'tmp/custom_reporter': ['test/fixtures/*.js']
                }
            },
            path_reporter: {
                options: {
                    verbose: false,
                    reporter: 'path'
                },
                src: ['test/fixtures/*.*']
            },
            markdown_reporter: {
                options: {
                    verbose: false,
                    reporter: 'markdown'
                },
                files: {
                    'tmp/markdown.md': ['test/fixtures/*']
                }
            }
        },
        mochaTest: {
            all: {
                options: {
                    reporter: 'mocha-unfunk-reporter'
                },
                src: ['test/*_test.js']
            }
        }

    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-continue');

    grunt.registerTask('pass', [
        'todos:default_options',
        'todos:custom_options',
        'todos:verbose_false',
        'todos:console',
        'todos:console_verbose_false',
        'todos:custom_reporter',
        'todos:path_reporter',
        'todos:markdown_reporter'
    ]);

    grunt.registerTask('fail', [
        'continueOn',
        'todos:high_priority',
        'continueOff'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'clean',
        'pass',
        'fail',
        'mochaTest:all'
    ]);

    grunt.registerTask('default', ['test']);

};
