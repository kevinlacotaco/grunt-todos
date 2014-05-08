'use strict';

function clean(line) {
    return line.replace(/^\/\/+[ \t]+/, '');
}

module.exports = {
    header : function () {
        return [
            '# TODO',
            '',
            'Updated: ' + new Date().toDateString(),
            ''
        ].join('\n') + '\n--\n'
    },

    fileTasks : function (file, tasks, options) {
        var memo = '';

        if(tasks.length === 0) {
            if (options.verbose) {
                memo += 'Tasks found in: ' + file + '\n\n';
                memo += '    ' + 'No tasks found!' + '\n\n';
            }
        } else {
            memo += '`' + file + '`\n\n';
            tasks.forEach(function(task) {
                memo += ' - [ ] line ' + task.lineNumber + ' - **' + task.priority + '** - ' + clean(task.line) + '\n';
            });
            memo += '\n--\n'
        }

        return memo;
    },

    footer : function () {

    }
};
