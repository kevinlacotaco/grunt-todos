# grunt-todos

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-todos.png?branch=master)](http://travis-ci.org/Bartvds/grunt-todos) [![NPM version](https://badge.fury.io/js/grunt-todos.png)](http://badge.fury.io/js/grunt-todos) [![Dependency Status](https://david-dm.org/Bartvds/grunt-todos.png)](https://david-dm.org/Bartvds/grunt-todos) [![devDependency Status](https://david-dm.org/Bartvds/grunt-todos/dev-status.png)](https://david-dm.org/Bartvds/grunt-todos#info=devDependencies)

> Grunt plugin for finding todos/fixmes in code

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-todos --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-todos');
```

## The "todos" task

### Overview

In your project's Gruntfile, add a section named `todos` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  todos: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.priorities

Type: `Object`
Default value: `{ low : /TODO/, med : /FIXME/, high : null }`

An object that specifies what the various priorities are for the target.
High will add to the errorCount.


#### options.verbose

Type: `Boolean`
Default value: `true`

Verbose mode will cause the plugin to report on every file, regardless if there are actual lines to report or not. If set to false, only files with todos will be mentioned.

#### options.reporter

Type: `String|Object`
Default value: `'default'`

Specify a reporter to use. A string value will be resolved first to one of the bundled reporter, otherwise passedto `require()`.

Bundled reporters:

- `default` - classic console reporter.
- `markdown` - simple markdown format.
- `path` - console reporter that print full file-paths.

See below for the 'Custom reporter' section on how to create a custom reporter.

### Usage Examples

#### Default Options

In this example, the default options are used to find all the TODOs and FIXMEs in the code.

```js
grunt.initConfig({
  todos: {
    options: {},
    src : ['src/testing', 'src/123']
  }
})
```

#### Save to file

Use the grunt file src/dest convention to write reporter output to a file. 

```js
grunt.initConfig({
  todos: {
    options: {},
    files: {
      'path/files.txt': ['src/testing', 'src/123']
    }
  }
})
```

#### Custom Options

In this example, custom options are used to escalate TODO to med priority.

```js
grunt.initConfig({
  todos: {
    options: {
        priorities : {
            low : null,
            med : /(TODO|FIXME)/
        }
    },
    src : ['src/testing', 'src/123']
  }
})
```

In this example, we want minimize the total output by setting `verbose` to false.

```js
grunt.initConfig({
  todos: {
    options: {
        verbose: false
    },
    src : ['src/**/*.js']
  }
})
```

### Custom Reporters

A custom reporter can be used to change the output of the task.

Reporters have three functions, `header`, `fileTasks`, and `footer`, that should return strings.
The result of `header` is printed once at the beginning of the task.
The result of `footer` is printed once at the end of the task.
The `fileTasks` function is called once for each file that is being scanned.

Printing to the console or to a file is still controlled by the use of the `src` versus `files` options.

```js
grunt.initConfig({
  todos: {
    options: {
      reporter: {
        header: function () {
          return '-- Begin Task List --\n';
        },
        fileTasks: function (file, tasks, options) {
          var result = '';
          result += 'For ' + file + '\n';
          tasks.forEach(function (task) {
            result += '[' + task.lineNumber + ' - ' + task.priority + '] ' + task.line + '\n';
          });
          result += '\n';
          return result;
        },
        footer: function () {
          return '-- End Task List--\n';
        }
      }
    }
  }
})
```

#### `file` Parameter

Type: `String`
The path to the file being scanned for tasks.

#### `tasks` Parameter

Type: `Array`
Contains the list of tasks found in the file.

An example `tasks` looks like this:

```js
{
  file: 'path/to/file.js',
  lineNumber: 27,
  priority: 'low', // 'med' or 'high'
  line: '    // TODO something grand and spectacular',
  pattern: /\bTODO\b/ // Pattern used to recognize the priority
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- `v0.3.x` - adopted for updates & fixes by Bart van der Schoor @Bartvds (2014-05)
- `<= v0.2.x` - original releases by Kevin Lakotko @kevinlacotaco

## Licence

Copyright (c) 2013 by [Kevin Lakotko](https://github.com/kevinlacotaco).

Licensed under the MIT License. 