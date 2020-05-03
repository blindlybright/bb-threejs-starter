// const path = require('path');
const webpackCommonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');

function config(opts) {
    const cfg = Object.assign({}, webpackCommonConfig(opts), {
        mode: 'development',
        devtool: 'inline-source-map',
    });
    cfg.plugins.push(
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'test', // use 'production' unless process.env.NODE_ENV is defined
        }),
    );

    return cfg;
}

module.exports = config({
    isTest: true,
    isDevelopment: false,
    isProduction: false,
});
