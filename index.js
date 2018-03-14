/* jshint node: true */
'use strict';

var nodemon = require('nodemon');
var RSVP = require('rsvp');
var path = require('path');
var which = require('which');

var { Promised } = RSVP;

module.exports = {
  name: 'ember-autoserve',

  includedCommands: function() {
    return {
      autoserve: {
        name: 'autoserve',
        description: 'Runs `ember serve` and will automatically restart it when necessary',
        works: 'insideProject',


        validateAndRun: function(rawArgs) {
          return this.run({}, rawArgs);
        },

        run: function(options, rawArgs) {
          return new Promise(function(resolve, reject) {
            nodemon({
              exec: which.sync('ember'),
              args: ['serve'].concat(rawArgs),
              watch: [
                'ember-cli-build.js',
                '.jshintrc',
                'tests/.jshintrc',
                'package.json',
                'bower.json',
                'index.js'
              ]
            });

            nodemon.on('start', function () {
              // console.log('`ember serve` has started');
            }).on('quit', function () {
              // console.log('`ember serve` has quit');
              resolve();
            }).on('restart', function (files) {
              console.log('Detected changes to: ' + files.map(function(f) { return path.basename(f); }).join(", "))
              console.log('Restarting `ember serve`');
            });
          });
        }
      }
    }
  }
};
