var fs = require('fs');
var path = require('path');

var connect = require('connect');

var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var sass = require('metalsmith-sass');

var port = process.env.PORT || 9000;

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.favicon())
  .use(connect.static(path.join(__dirname, 'build')))
  .use(connect.directory(path.join(__dirname, 'build')));

var assets = Metalsmith(__dirname)
  .use(templates({
    engine: 'nunjucks',
    inPlace: true
  }))
  .use(sass({
    outputStyle: 'compact'
  }));

assets.build(function (err, res) {
  app.listen(+port, function () {
    console.log('Open your browser to http://localhost:' + port + '/');

    fs.watch(path.join(__dirname, 'src'), watch);
    fs.watch(path.join(__dirname, 'templates'), watch);
  });
});

function watch (event, filename) {
  console.log(event + ': ' + filename + '...');
  if (filename) {
    assets.build(function (err, res) {
      if (err) { return console.error(err); }
      console.log('  ...done');
    });
  }
}
