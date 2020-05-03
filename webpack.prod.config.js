// todo: optimizations for css: remove comments

// const path = require('path');
const webpackCommonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJsPlugin = require('uglifyes-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function config(opts) {
    const cfg = Object.assign({}, webpackCommonConfig(opts), {
        mode: 'production',
        devtool: false
    });

    cfg.optimization.minimizer = [
        new UglifyJsPlugin({
            test: /\.js$/i,
            extractComments: false,
            sourceMap: true, // nb: this is likely depends on type of devtool (which is false for prod)
            cache: false,
            parallel: false,
            uglifyOptions: {
                ecma: 5,
                warnings: false,
                ie8: false,
                mangle: false, // be careful here with angularjs & three
                compress: {},
                output: {
                    comments: false,
                },
            },
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
        }),
    ];

    cfg.plugins.push(
        // // currently useless cause no json & images used until
        // new CopyPlugin([{
        //     from: 'json/',
        //     to: 'json/',
        //     context: 'src/',
        // }]),
        // new CopyPlugin([{     // for hard copy of all images including possibly useless (svg isn't exported by default)
        //     from: 'images/',
        //     to: 'images/',
        //     context: 'src/',
        // }]),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production', // use 'production' unless process.env.NODE_ENV is defined
        }),
    );

    return cfg;
}

module.exports = config;
