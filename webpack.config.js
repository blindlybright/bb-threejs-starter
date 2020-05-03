const argv = require('yargs').argv;

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const opts = {
    isDevelopment,
    isProduction,
};

const webpackDevConfig = require('./webpack.dev.config.js')(opts);
const webpackProdConfig = require('./webpack.prod.config.js')(opts);
const webpackTestConfig = require('./webpack.test.config.js');

const config = Object.assign(isDevelopment
    ? webpackDevConfig
    : isProduction
        ? webpackProdConfig
        : webpackTestConfig,
);

module.exports = config;
