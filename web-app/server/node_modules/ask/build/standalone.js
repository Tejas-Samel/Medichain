#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var minify = require('minify');
var mkdirp = require('mkdirp');

var ENTRY_FILE = path.resolve(__dirname, '../index.js');
var DIST_FILE = path.resolve(__dirname, '../dist/ask.js');
var DIST_FILE_MIN = path.resolve(__dirname, '../dist/ask.min.js');

// Create dist directory
mkdirp.sync(path.resolve(__dirname, '../dist'));

console.log('Bundling ...');

browserify(ENTRY_FILE, {
    standalone: 'Ask'
  })
  .bundle()
  .pipe(fs.createWriteStream(DIST_FILE)).on('close', optimize);

function optimize () {
  var contents = fs.readFileSync(DIST_FILE, 'utf8');
  fs.writeFileSync(DIST_FILE_MIN, contents);
  
  console.log('Minifying ...\n')
  minify(DIST_FILE_MIN, function (minifiedContents) {
    fs.writeFileSync(DIST_FILE_MIN, minifiedContents);
    console.log('Build complete!');
  });
}
