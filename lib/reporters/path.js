'use strict';

var path = require('path');

/*jshint -W098*/

function padL(str, len, char) {
    str = '' + str;
    char = char.charAt(0);
    while (str.length < len) {
        str = char + str;
    }
    return str;
}

function padR(str, len, char) {
    str = '' + str;
    char = char.charAt(0);
    while (str.length < len) {
        str += char;
    }
    return str;
}

function color(str, level) {
    if (level === 'low') {
        return str.blue;
    }
    if (level === 'med') {
        return str.yellow;
    }
    if (level === 'high') {
        return str.red;
    }
    return str;
}
var levelMaxLength = 4;
var termExp = /^[ \t]*\/\/[ \t]*([\w]+)[ \t]*:?[ \t]*(.*?)[ \t]*$/;

module.exports = {
    header: function () {
        return '';
    },

    footer: function () {
        return '';
    },

    fileTasks: function (file, tasks, options) {

        //pre layout for visually matching columns
        var lead = 'Tasks found in: ';
        var columns = lead.length;
        var left = 3 + levelMaxLength + 1;

        if (tasks.length > 0) {
            var loop = [];

            //precalc
            tasks.forEach(function (task) {
                var data = {
                    line: '',
                    term: '',
                    task: task
                };
                var tmp = task.line.match(termExp);
                data.term = tmp[1];
                data.line = tmp[2];
                columns = Math.max(columns, left + data.term.length + 2);
                loop.push(data);
            });

            //print header
            var result = padR(lead, columns, ' ').cyan + file.replace(/^(.*?)([^\\\/]*)$/, function (match, first, second) {
                return first + second.cyan;
            }) + '\n';

            //print each item
            result += loop.map(function (data) {
                var ret = '';
                var right = columns - left;

                ret += '-> ' + path.resolve(data.task.file) + '[' + data.task.lineNumber + ']' + '\n';
                //left part
                ret += '   ' + color(padR(data.task.priority, levelMaxLength, ' '), data.task.priority) + ' ';
                //right part
                ret += color(padR(data.term + ': ', right, ' '), data.task.priority).bold + data.line;

                return ret;
            }).join('\n') + '\n';

            return result;
        }
        return '';
    }
};
