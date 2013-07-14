/* jshint strict: false */
/* global exports,process */

var async = require('async'),
    fs = require('fs'),
    _ = require('underscore');

var fileReader = function(file, reg, fn) {
    fs.readFile(file, {encoding : 'ascii' }, function(err, data) {
        var lines = data.split(/\r*\n/);
        var results = [];

        _.each(lines, function(line, index) {
            if(reg.test(line)) {
                results.push({ line : line, lineNumber : index + 1, pattern : reg, file : file });
            }
        });

        fn(null, results);
    });

};

var grep = function(pattern, files, fn) {
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
        fileReader(file, regex, fn);
    }

    async.mapLimit(files, 10, iterator, fn);
};

exports.grep = grep;
