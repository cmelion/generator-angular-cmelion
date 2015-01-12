'use strict';
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.option('app-suffix', {
    desc: 'Allow a custom suffix to be added to the module name',
    type: String,
    required: 'false'
  });
  this.scriptAppName = this.appname;

  args = ['index'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'src';
  }

  this.appPath = this.env.options.appPath;

  this.hookFor('angular-cmelion:common', {
    args: args
  });

  this.hookFor('angular-cmelion:main', {
    args: args
  });


  //this.hookFor('angular-cmelion:repository', {
  //  args: ['my-test']
  //});

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModules = function askForModules() {
  var cb = this.async();

    var prompts = [
        {
            type: 'checkbox',
            name: 'modules',
            message: 'Which modules would you like to include?',
            choices: [
                {
                    value: 'ngStorageModule',
                    name: 'angular-storage.js',
                    checked: false
                },
                {
                    value: 'touchModule',
                    name: 'angular-touch.js',
                    checked: false
                },
                {
                    value: 'restangularModule',
                    name: 'restangular.js',
                    checked: false
                },
                {
                    value: 'resourceModule',
                    name: 'angular-resource.js',
                    checked: false
                },
                {
                    value: 'cookiesModule',
                    name: 'angular-cookies.js',
                    checked: false
                },
                {
                    value: 'sanitizeModule',
                    name: 'angular-sanitize.js',
                    checked: false
                }
            ]
        }
    ];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');
    this.restangularModule = hasMod('restangularModule');
    this.touchModule = hasMod('touchModule');

    this.ngStorageModule = hasMod('ngStorageModule');

    var angMods = ["'cmelion.routeProvider'","'kennethlynne.componentFactory'", "'ngSymbiosis.utils'",  "'ngSymbiosis.repository'", "'ngSymbiosis.model'", "'" + this.scriptAppName + ".components'", "'ngAnimate'", "'ajoslin.promise-tracker'", "'cgBusy'", "'chieffancypants.loadingBar'", "'ui.router'", "'ui.bootstrap'"];

      if (this.cookiesModule) {
          angMods.push("'ngCookies'");
      }
      if (this.resourceModule) {
          angMods.push("'ngResource'");
      }
      if (this.restangularModule) {
          angMods.push("'restangular'");
      }
      if (this.sanitizeModule) {
          angMods.push("'ngSanitize'");
      }
      if (this.touchModule) {
          angMods.push("'ngTouch'");
      }
      if (this.ngStorageModule) {
          angMods.push("'ngStorage'");
      }

    this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") +"\n";

    cb();
  }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
  this.indexFile = this.engine(this.read('../../templates/common/index.html'), this);
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function () {

    var context = {
      scriptAppName: this.scriptAppName,
      classedName   : 'MyTest',
      pluralizedName: 'my-tests',
      dasherizedName: 'my-test'
    };
    //Configuration
    this.template('../../templates/common/_bower.json', 'bower.json');
    this.template('../../templates/common/_package.json', 'package.json');
    this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
    this.template('../../templates/javascript/framework/config.js', this.env.options.appPath + '/config/config.js');
    //Navbar
    this.template('../../templates/javascript/navbar.js', this.env.options.appPath + '/components/navbar/navbar.js');
    this.template('../../templates/javascript/spec/navbar.js', 'test/unit/spec/components/navbar.js');
    //Error page/state
    this.template('../../templates/javascript/framework/errorCtrl.js', this.env.options.appPath + '/states/error/index/error.js');
    this.template('../../templates/javascript/spec/errorCtrl.js', 'test/unit/spec/states/error/index/error.js');
    //Main page/state
    this.template('../../templates/javascript/framework/mainCtrl.js', this.env.options.appPath + '/states/index/index/index.js');
    this.template('../../templates/javascript/spec/mainCtrl.js', 'test/unit/spec/states/index/index/index.js');
    //Repositories
    this.template('../../templates/javascript/repository.js', this.env.options.appPath + '/scripts/factories/my-test-repository.js', context);
    this.template('../../templates/javascript/spec/repository.js', 'test/unit/spec/scripts/repositories/my-test-repository.js', context);
    //Models
    this.template('../../templates/javascript/model.js', this.env.options.appPath + '/scripts/models/my-test.js', context);
    this.template('../../templates/javascript/spec/model.js', 'test/unit/spec/scripts/models/my-test.js', context);
    //Mocks
    this.template('../../templates/javascript/framework/mock-api.js', this.env.options.appPath + '/dev/mock-api.js');
    this.template('../../templates/javascript/mock-crud-api.js', this.env.options.appPath + '/dev/' + context.dasherizedName + '-mock.js', context);
    this.template('../../templates/javascript/mock-crud-api.json', this.env.options.appPath + '/dev/' + context.dasherizedName + '-mock.json');
};
