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
        // Merge task-specific and/or target-specific options with these defaults.
        // TODO: some sample todo
        var options = this.options({
            priorities : {
                low : /TODO/, //This will print out green
                med : /FIXME/, //This will print out yellow
                high : null //This will print out red and cause grunt to fail
            }
        }), esprima = require('esprima'), syntax, tasks = {}, _ = grunt.util._;

        function addTask(priority, regex, file, comment) {
            if(!_.isNull(regex) && regex.test(comment)) {
                if(!tasks[file]) {
                    tasks[file] = {};
                    tasks[file][priority] = [];
                } else if(!tasks[file][priority]) {
                    tasks[file][priority] = [];
                }
                tasks[file][priority].push( comment );
            }
        }

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                syntax = esprima.parse(grunt.file.read(filepath), { comment : true, tolerant : true, loc : true });
                syntax.comments.forEach(function(comment) {
                    _.each(options.priorities, function(value, key) {
                        addTask(key, value, filepath, comment.value);
                    });
                });
            });
        });

        grunt.log.writeln();
        var errors = 0;
        _.each(tasks, function(value, key) {
            grunt.log.writeln('Tasks found in: '.white  + key.green);

            _.each(tasks[key].low, function(low) {
                grunt.log.writeln('    ' + _.trim(low).green);
            });

            _.each(tasks[key].med, function(med) {
                grunt.log.writeln('    ' + _.trim(med).yellow);
            });

            _.each(tasks[key].high, function(high) {
                grunt.log.writeln('    ' + _.trim(high).red);
                errors++;
            });
        });

        if(errors !== 0) {
            grunt.log.writeln();
            grunt.log.error('Found ' + errors + ' high priority tasks');
        }

        return this.errorCount === 0;

    });

};
