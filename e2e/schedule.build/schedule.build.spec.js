'use strict';
var config = browser.params;

describe('Schedule Build', function() {
  var page;

  beforeEach(function() {
    browser.get(config.baseUrl + '/schedule/build');
    page = require('./schedule.build.po');
  });

  it('URL test', function() {
    expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/schedule/build'); //1
    expect(page.panelBody.getText()).toBe(''); //2
  });
});
