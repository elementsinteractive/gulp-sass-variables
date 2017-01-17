
var PLUGIN_NAME = 'gulp-sass-variables';

var gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    through = require('through2');

var getVariablesBuffer = function(sassVariables, file) {
  var str = '';

  for(var variable in sassVariables) {
    str += '$' + variable + ': ' + sassVariables[variable] + ';\n';
  }


  return new Buffer(str, file);
}

module.exports = function(sassVariables) {

  return through.obj(function (file, encoding, cb) {

    if(file.isNull()) {
      return cb(null, file);
    }

    if(file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if(sassVariables && typeof sassVariables === 'object') {
      var variablesBuffer = getVariablesBuffer(sassVariables, file);
      file.contents = Buffer.concat([variablesBuffer, file.contents], variablesBuffer.length + file.contents.length);
    } else {
      return cb(new PluginError(PLUGIN_NAME, 'Variables object expected'));
    }

    return cb(null, file);

  });
};
