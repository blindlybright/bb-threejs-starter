// const path = require('path');
const webpackCommonConfig = require('./webpack.common.config.js');

const webpack = require('webpack');
// const path = require('path');
// const apiMocker = require('mocker-api');

function config(opts) {
    const cfg = Object.assign({}, webpackCommonConfig(opts), {
        mode: 'development',
        // devtool: "inline-source-map",
        devtool: 'cheap-eval-source-map',
        devServer: {
            port: 9000,
            contentBase: './src',
            watchContentBase: true,   // for watch .html files
            index: 'index.html',
            openPage: '',
            // before: function(app) {
            //     apiMocker(app, path.resolve('./mocker-api/index.js'));
            //
            //     // apiMocker(app, path.resolve('./mocker-api/index.js'), {
            //     //     proxy: {
            //     //         '/repos/*': 'https://api.github.com/',
            //     //     },
            //     //     changeHost: true,
            //     // });
            //
            //     // NB: originally express response example
            //     // app.get('/some/path', function(req, res) {
            //     //     res.json({ custom: 'response' });
            //     // });
            // },
            // // ,
            // // stats: 'verbose'
        },
    });
    cfg.plugins.push(
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
        }),
    );
    return cfg;
}

module.exports = config;
