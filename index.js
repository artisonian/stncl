var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var sass = require('metalsmith-sass');

var BROWSER_SYNC_BIN = path.resolve('./node_modules/.bin/browser-sync');

var assets = Metalsmith(__dirname)
  .use(templates({
    engine: 'nunjucks',
    inPlace: true
  }))
  .use(sass({
    outputStyle: 'compact'
  }));

assets.build(function (err, res) {
  if (err) { console.error(err); }

  fs.watch(path.join(__dirname, 'src'), watch);
  fs.watch(path.join(__dirname, 'templates'), watch);

  spawn(BROWSER_SYNC_BIN, ['start', '--files', 'build/*', '--server', 'build'], {
    stdio: ['ignore', process.stdout, process.stderr]
  });
});

function watch (event, filename) {
  if (filename) {
    assets.build(function (err, res) {
      if (err) { return console.error(err); }
    });
  }
}
