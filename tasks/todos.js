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
        var options = this.options({
            verbose: true, // false will skip reporting on files without tasks
            priorities : {
                low : /TODO/, //This will print out blue
                med : /FIXME/, //This will print out yellow
                high : null //This will print out red and cause grunt to fail
            }
        }),
        esprima = require('esprima'),
        _ = grunt.util._,
        errors = 0,
        comments = [],
        colors = {
            low : 'blue',
            med : 'yellow',
            high : 'red'
        },
        syntax;

        function log (msg) {
            grunt.log.writeln(msg);
        }

        //TODO: new format for reporting
        function detectComments(file, comment) {
            _.each(options.priorities, function(regex, priority) {
                if (!_.isNull(regex) && regex.test(comment.value)) {
                    //Matches a priority
                    if(priority === 'high') {
                        errors++;
                    }
                    comments.push('[Line: '.bold + comment.loc.start.line.toString().bold + '] '.bold + comment.value[colors[priority]]);
                }
            });
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
                comments = []; // reset comment stack
                
                if (syntax.comments.length) {
                  // Find matching lines and report
                  syntax.comments.forEach(function(comment) {
                      detectComments(filepath, comment);
                  });
                  
                  if (comments.length === 0) {
                    if (options.verbose === true) {
                      log('Tasks found in: '.white + filepath.green);
                      log('    ' + 'No tasks found.'.white);
                    }
                  } else {
                    log('Tasks found in: '.white + filepath.green);
                    comments.forEach(function(comment) {
                        log('    ' + comment);
                    });
                  }
                }
            });
        });

        if(errors !== 0) {
            grunt.log.error('Found ' + errors + ' high priority tasks');
        }

        return this.errorCount === 0;

    });

};
