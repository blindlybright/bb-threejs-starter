
// todo:
// https://github.com/karma-runner/karma-chrome-launcher // puppeteer && ChromeHeadless

const path = require('path');


const webpackConfig = require('./webpack.test.config');
webpackConfig.entry = {
  specs: './specs.js'
};


// css modules: no need for tests, declare noop loader
webpackConfig.module.rules[0].use = {
  loader: 'null-loader'
};

// js modules: no need to fix loader
// webpackConfig.module.rules[1].use = {...//noop};

// images modules: no need for tests, declare noop loader
webpackConfig.module.rules[2].use = {
  loader: 'null-loader'
};

// add post loader for istanbul coverage loader
webpackConfig.module.rules.push({
  test: /\.js$$|\.ts$/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: {
      esModules: true
    }
  },
  include: path.resolve('src/'),
  enforce: 'post',
  exclude: /node_modules|bower_components|\.spec\.js$|\.spec\.ts$/,
});


// empty common plugins for testing purposes (no html && css used)
webpackConfig.plugins = [];



module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: [ 'mocha' ], // use the mocha test framework, seems like it's included before each starting tests

    files: [
      'specs.js',            // just load this file
    ],

    preprocessors: {
      'specs.js': [ 'webpack', 'sourcemap' ],                     // preprocess with webpack and our sourcemap loader
    },

    reporters: [ /* 'dots', */ 'progress', 'coverage-istanbul' ], // report results in this formats

    coverageIstanbulReporter: {
      dir: path.join(__dirname, 'coverage'),
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true
      // ,
      // verbose: true
    },

    colors: true,
    loglevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [ 'Chrome' ],  // run in Chrome
    singleRun: true,         // just run once by default
    autoWatchBatchDelay: 300,

    webpack: webpackConfig,
    webpackServer: {
      noInfo: true           // please don't spam the console when running in karma!
    }
  });
};
