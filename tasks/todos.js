/*
 * grunt-todos
 * https://github.com/kevinlacotaco/grunt-todos
 *
 * Copyright (c) 2013 Kevin Lakotko
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
    'use strict';

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('todos', 'Find and print todos/fixmes as tasks in code.', function() {
        var done = this.async();
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            verbose: true, // false will skip reporting on files without tasks
            encoding : 'utf8', // encoding to read files
            trim : true, // trim lines
            priorities : {
                low : /TODO/, //This will print out blues
                med : /FIXME/, //This will print out yellow
                high : null //This will print out red and cause grunt to fail
            },
            reporter : require('../lib/reporters/default')
        });

        var grep = require('../lib/grep');
        var path = require('path');
        var async = require('async');
        var _ = grunt.util._;

        var reporter = options.reporter;

        if (_.isString(reporter)) {
            // check for bundled reporter
            var p = path.resolve(__dirname, '..', 'lib', 'reporters', reporter + '.js');
            if (grunt.file.exists(p)) {
                reporter = require(p);
            }
            else {
                reporter = require(reporter);
            }
        }

        function getPriority(pattern) {
            return _.invert(options.priorities)[pattern];
        }

        function injectPriority(task) {
            task.priority = getPriority(task.pattern);
        }

        function plural(str, num) {
            if(num === 1) {
                return str;
            }
            return str + 's';
        }

        if (!_.isFunction(reporter.fileTasks)) {
            grunt.fail.fatal('grunt-todos reporter must specify a "fileTasks" function.');
            done();
        }

        async.each(this.files, function(f, cb) {
            var files = [];

            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(file) {
                files.push(file);
            });

            async.series([
                function(cb) {
                    if(!_.isUndefined(options.priorities.low) && !_.isNull(options.priorities.low)) {
                        grep.grep(options.priorities.low, files, options, cb);
                    } else {
                        cb();
                    }
                },
                function(cb) {
                    if(!_.isUndefined(options.priorities.med) && !_.isNull(options.priorities.med)) {
                        grep.grep(options.priorities.med, files, options, cb);
                    } else {
                        cb();
                    }
                },
                function(cb) {
                    if(!_.isUndefined(options.priorities.high) && !_.isNull(options.priorities.high)) {
                        grep.grep(options.priorities.high, files, options, cb);
                    } else {
                        cb();
                    }
                }

            ], function(err, results) {
                var tasksByFile = _.chain(results)
                                    .flatten()
                                    .compact()
                                    .each(injectPriority)
                                    .groupBy('file')
                                    .value();

                var noTaskFiles = _.difference(files, _.keys(tasksByFile));

                _.each(noTaskFiles, function(file) {
                    tasksByFile[file] = [];
                });

                var log = '';
                var header, footer;

                header = _.isFunction(reporter.header) ? reporter.header() : '';
                if (header && !_.isEmpty(header)) {
                    log += header;
                }

                _.each(tasksByFile, function (tasks, file) {
                    log += reporter.fileTasks(file, tasks, options);
                });

                footer = _.isFunction(reporter.footer) ? reporter.footer() : '';
                if (footer && !_.isEmpty(footer)) {
                    log += footer;
                }

                if(_.isUndefined(f.dest)) {
                    grunt.log.write(log);
                } else {
                    grunt.file.write(f.dest, grunt.log.uncolor(log));
                    grunt.log.writeln('File "' + f.dest + '" created.');
                }

                var high = _.reduce(tasksByFile, function(count, tasks) {
                    _.forEach(tasks, function(task) {
                        if (task.priority === 'high') {
                            count++;
                        }
                    });
                    return count;
                }, 0);

                if(high > 0) {
                    grunt.log.writeln('');
                    grunt.log.error('Found ' + high + ' high priority ' + plural('task',high)+ '.');
                    grunt.log.writeln('');
                    cb(new Error());
                } else {
                    cb();
                }

            });

        }, function(err) {
            if(err) {
                done(false);
            } else {
                done();
            }
        });

    });
};
