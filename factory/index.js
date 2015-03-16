'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.typeSuffix = '.factory';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.generateSourceAndTest(
    'service/factory',
    'spec/service',
    'factories/',
    '../unit/spec/scripts/factories/',
    this.dasherizedName + this.typeSuffix
  );
};
