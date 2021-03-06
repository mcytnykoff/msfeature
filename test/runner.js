/* eslint no-console:0 */

var async = require('async');
var Cli = require('../lib/cli/cli.js');

// Execute from /test so that it auto-load from /test/features
process.chdir(__dirname);

function suite(browser, port, callback) {
  var config = Cli.DEFAULT_CONFIG;
  config.driver.desiredCapabilities.browserName = browser;
  config.driver.port = port;
//  config.format = 'progress';
  /* Debugging Tags
  config.tags = ['@fixme'];
    config.tags = [];
  */
  //config.tags = ['@wip'];

  Cli.run(config, callback);
}

async.series([/*
  function(cb) {
    process.stdout.write('\nPhantomJS: Complete suite.\n\n');
    suite('phantomjs', 8910, cb);
  }, */
  function(cb) {
    process.stdout.write('\nFirefox: Complete suite.\n\n');
    suite('firefox', 4444, cb);
  }/*, 
  function(cb) {
    process.stdout.write('\nChrome: Complete suite.\n\n');
    suite('chrome', 4444, cb);
  }  
  * Travis does not have chrome so run locally only 
  */
]);
