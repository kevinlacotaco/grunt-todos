var fs = require('fs');
var async = require('async');
var grunt = require('grunt');
var _ = grunt.util._;

var fileReader = function(file, reg, options, fn) {
    fs.stat(file, function(err, stat) {
        if (!stat.isFile()) {
            return;
        }
        fs.readFile(file, {encoding : options.encoding }, function(err, data) {
            var lines = data.split(/\r*\n/);
            var results = [];

            _.each(lines, function(line, index) {
                if (options.trim) {
                    line = line.replace(/(?:^\s*)|(?:\s*$)/g, '');
                }
                if(reg.test(line)) {
                    results.push({ line : line, lineNumber : index + 1, pattern : reg, file : file });
                }
            });

            fn(null, results);
        });
    });
};

var grep = function(pattern, files, options, fn) {
    var regex;
    if(_.isString(pattern)) {
        regex = new RegExp(pattern, 'g');
    } else {
        regex = pattern;
    }

    if(_.isString(files)) {
        //One file was passed in so convert it to an array
        files = [files];
    }

    function iterator(file, fn) {
        fileReader(file, regex, options, fn);
    }

    async.mapLimit(files, 10, iterator, fn);
};

exports.grep = grep;
