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
            priorities : {
                low : /TODO/, //This will print out blue
                med : /FIXME/, //This will print out yellow
                high : null //This will print out red and cause grunt to fail
            },
            reporter : require('../lib/reporters/default')
        }),
        grep = require('../lib/grep'),
        async = require('async'),
        _ = grunt.util._;

        function getPriority(pattern) {
            return _.invert(options.priorities)[pattern];
        }

        function injectPriority(task) {
            task.priority = getPriority(task.pattern);
        }

        if (!_.isFunction(options.reporter.fileTasks)) {
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
                        grep.grep(options.priorities.low, files, cb);
                    } else {
                        cb();
                    }
                },
                function(cb) {
                    if(!_.isUndefined(options.priorities.med) && !_.isNull(options.priorities.med)) {
                        grep.grep(options.priorities.med, files, cb);
                    } else {
                        cb();
                    }
                },
                function(cb) {
                    if(!_.isUndefined(options.priorities.high) && !_.isNull(options.priorities.high)) {
                        grep.grep(options.priorities.high, files, cb);
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

                header = _.isFunction(options.reporter.header) ? options.reporter.header() : '';
                if (header && !_.isEmpty(header)) {
                    log += header;
                }

                _.each(tasksByFile, function (tasks, file) {
                    log += options.reporter.fileTasks(file, tasks, options);
                });

                footer = _.isFunction(options.reporter.footer) ? options.reporter.footer() : '';
                if (footer && !_.isEmpty(footer)) {
                    log += footer;
                }

                if(_.isUndefined(f.dest)) {
                    grunt.log.write(log);
                } else {
                    grunt.file.write(f.dest, grunt.log.uncolor(log));
                    grunt.log.writeln('File "' + f.dest + '" created.');
                }

                if(results.high !== undefined && results.high.length > 0) {
                    grunt.log.error('Found ' + results.high.length + ' high priority tasks.');
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
