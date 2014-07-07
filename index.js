var domain = require('domain');
var path = require('path');
var spawn = require('child_process').spawn;

var chokidar = require('chokidar');
var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var sass = require('metalsmith-sass');

var BROWSER_SYNC_BIN = path.resolve('./node_modules/.bin/browser-sync');
var browserSync;

process.on('exit', exit);

var assets = Metalsmith(__dirname)
  .clean(false)
  .use(templates({
    engine: 'nunjucks',
    inPlace: true
  }))
  .use(sass({
    outputStyle: 'compact'
  }));

var d = domain.create();

d.on('error', exit);

d.run(function () {
  assets.build(function (err, res) {
    if (err) { console.error(err); }

    chokidar.watch(path.join(__dirname, 'src')).on('all', watch);
    chokidar.watch(path.join(__dirname, 'templates')).on('all', watch);

    browserSync = spawn(BROWSER_SYNC_BIN, ['start', '--files', 'build/*', '--server', 'build'], {
      stdio: ['ignore', process.stdout, process.stderr]
    });
  });
});

function watch (event, path) {
  console.log('detected changes:', path);
  assets.build(function (err, res) {
    if (err) { return console.error(err); }
  });
}

function exit (err) {
  if (err) { console.error(err.stack ? err.stack : new Error('Unknown error')); }
  if (browserSync) { browserSync.kill(); }
}
