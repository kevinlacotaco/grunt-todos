var colors = {
    low : 'blue',
    med : 'yellow',
    high : 'red'
};

module.exports = {
    header : function () {

    },

    fileTasks : function (file, tasks, options) {
        var memo = '';

        if(tasks.length === 0) {
            if (options.verbose) {
                memo += 'Tasks found in: '.white + file.green + '\n';
                memo += '    ' + 'No tasks found!'.white + '\n';
            }
        } else {
            memo += 'Tasks found in: '.white + file.green + '\n';
            tasks.forEach(function(task) {
                memo += '    ' + '[Line: '.bold + task.lineNumber.toString().bold + '] '.bold + '['.bold + task.priority.toString().bold + '] '.bold + task.line.toString()[colors[task.priority]] + '\n';
            });
        }

        return memo;
    },

    footer : function () {

    }
};