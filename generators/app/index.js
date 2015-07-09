'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user
    this.log(yosay(
      'This Yeoman generator will create a simple ' + chalk.green('Flask & Angular') + ' web app for you.'
    ));

    // Accept one optional argument: appName
    this.argument('appName', { type: String, required: false });
    if (this.appName) {
      done();
    } else {
      // If the appName wasn't passed in as an argument, prompt for it
      var prompts = [{
        type: 'input',
        name: 'appName',
        message: 'What is the name of your application?',
        default: 'my-app'
      }];
      this.prompt(prompts, function (props) {
        // Set appName on 'this' for later use
        this.appName = props.appName;
        done();
      }.bind(this));
    }
  },

  writing: {
    // Copy all the things!
    app: function () {
      this.directory('src');
      this.directory('bin');
      this.copy('package.json');
      this.copy('bower.json');
      this.copy('virtualenv.py');
    },

    projectfiles: function () {
      //
      // TODO: check out if these have template values in them
      //
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    // Install bower and npm dependencies
    this.installDependencies();
  },

  end: function() {
    // My own spawnCommand adapter that pipes stdio and sets a callback on 'exit' event
    var mySpawn = function (self, command, args, callback) {
      var spawnEmitter = self.spawnCommand(command, args, { stdio: 'pipe' });
      if (callback) {
        spawnEmitter.on('exit', callback);
      }
      return spawnEmitter;
    }

    // See the docs here to see what ChildProcess events are available:
    // https://nodejs.org/api/child_process.html#child_process_class_childprocess
    this.log('Installing virtualenv in directory /venv ...');
    mySpawn(this, 'python', ['virtualenv.py', '--no-setuptools', 'venv'], function () {
      mySpawn(this, 'venv/bin/python', ['-m', 'ensurepip'], function () {
        this.log('Installing Flask ...');
        mySpawn(this, 'venv/bin/pip', ['install', 'flask'], function () {
          this.log();
          this.log('All done creating project: ' + chalk.green(this.appName));
          this.log('Run the server with: ' + chalk.bold.cyan('venv/bin/python bin/run.py'));
          this.log();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
});
