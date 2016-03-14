'use strict';

const path                  = require('path');
const fs                    = require('fs');
const graphql               = require('graphql').graphql;
const introspection         = require('graphql/utilities').introspectionQuery;
const browserify            = require('browserify');
const relayPlugin           = require('babel-relay-plugin');
const lessify               = require('node-lessify');
const schema                = require('../schema');

module.exports = () => {
  console.log('Build Browserify/Babel');

  return new Promise((resolve, reject) => {
    graphql(schema, introspection)
    .then(result => {
      browserify([
          path.join(process.cwd(), '/app/client/App.jsx'),
          // path.join(process.cwd(),'/app/client/styles/styles.less')
        ], {
          debug: true,
          basedir: path.join(process.cwd(), '/app/client'),
          paths: [path.join(process.cwd(), '/app/client')],
          extensions: ['.jsx','.es6','.js','.json','.es7'],
          cache: {},
          packageCache: {},
          fullPaths: true
      })
      .transform('babelify', {
        presets: ['es2015','stage-0','react'],
        plugins: (result && result.data) ? [relayPlugin(result.data)] : [],
        extensions: ['.jsx','.es6','.js','.json','.es7'],
      })
      // .transform(lessify)
      .on('bundle', (bundle) => {
        bundle.pipe(fs.createWriteStream(path.join(process.cwd(), '/app/public/js/app.js')));
        console.log('Build Browserify/Babel done.');
        resolve();
      })
      .bundle();

    })
    .catch(error => reject(error));
  });
}
