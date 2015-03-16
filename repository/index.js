'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');
var path = require('path');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);
    this.hookFor('angular-cmelion:crud-mock');
    this.typeSuffix = '.repo';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createRepositoryFiles = function createRepositoryFiles() {
    this.generateSourceAndTest(
        'model',
        'spec/model',
        'models/',
        '../unit/spec/models/'
    );

    this.generateSourceAndTest(
        'repository',
        'spec/repository',
        'repositories/',
        '../unit/spec/repositories/',
        this.dasherizedName + this.typeSuffix
    );
};
