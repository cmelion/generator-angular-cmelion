'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.typeSuffix = '.provider';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.generateSourceAndTest(
    'service/provider',
    'spec/service',
    'providers/',
    '../unit/spec/providers/',
    this.dasherizedName + this.typeSuffix
  );
};
