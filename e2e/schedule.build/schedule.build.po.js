'use strict';

var scheduleBuildPage = function() {
  this.container = element(by.css('.schedule.build-container'));
  this.panelBody = this.container.element(by.css('.panel-body'));
};

module.exports = new scheduleBuildPage();
