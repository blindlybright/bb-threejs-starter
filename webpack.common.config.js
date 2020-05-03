const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const autoprefixer = require('autoprefixer');

function config(opts) {
    return {
        mode: 'none',
        devtool: '',
        entry: {
            index: './src/js/index.ts',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: opts.isDevelopment ? 'js/[name].bundle.js' : 'js/[name].[hash].bundle.js',
            chunkFilename: opts.isDevelopment ? 'js/[name].chunk.bundle.js' : 'js/[name].[hash].chunk.bundle.js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.ts', '.js'], // Priorities while resolving require with absent extensions
        },
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
            // hints: !opts.isProduction ? "warning" : false
        },
        optimization: {
            runtimeChunk: false, // building 'runtime' chunk
            splitChunks: {
                chunks: 'all',
                minSize: 1024,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                automaticNameMaxLength: 30,
                name: true,
                cacheGroups: {
                    // default: false,
                    // vendors: false,
                    default: {
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 1,
                        reuseExistingChunk: false,
                        priority: -100,
                    },
                    // starter: {
                    //     name: 'starter',
                    //     chunks: 'initial',
                    //     reuseExistingChunk: true,
                    //     priority: -50,
                    // },
                    // nb: strangely `vendors` is somehow required to be redefined
                    // nb: seems now useless, cause of async main chunk loading
                    vendors: {
                        chunks: 'all',
                        test: function (module /*, chunks */) {
                            // This prevents stylesheet resources with the .css or .scss extension
                            // from being moved from their original chunk to the vendor chunk
                            if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                                return false;
                            }
                            return module.context && module.context.includes('node_modules');
                        },
                        name: 'vendors',
                        enforce: true,
                        reuseExistingChunk: true,
                        priority: -10,
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    // test: /\.(sa|sc|c)ss$/,
                    test: /\.(sc|c)ss$/,
                    use: [
                        // fallback to style-loader in development
                        !opts.isProduction
                            ? 'style-loader'
                            : {
                            // {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    publicPath: '../',
                                    // hmr: opts.isDevelopment // or tests?
                                }
                            },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: true,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [autoprefixer],
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }

                    ],
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                },
                {
                    test: /\.(png|jp(e*)g|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 4000, // Convert images < 8kb to base64 strings
                            name: 'images/[name].[ext]',
                        },
                    }],
                },
                // {
                //     test:   /\.svg$/,
                //     issuer: /\.js$|\.jsx$/,
                //     use:    [
                //         { loader: 'babel-loader' },
                //         { loader: 'react-svg-loader', options: { svgo: svgoOptions.inlineEntries } },
                //         { loader: 'svgo-loader', options: svgoOptions.inlineEntries }
                //     ]
                // },
                {
                    test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                            // , outputPath: 'fonts/'
                        },
                    }],
                },
                // {
                //     test: /\.jsx?$/,
                //     exclude: /(node_modules|bower_components)/,
                //     use: {
                //         loader: 'babel-loader',
                //         options: {
                //             presets: ['@babel/preset-env', '@babel/preset-react'],
                //             plugins: ['@babel/plugin-proposal-object-rest-spread'],
                //         }
                //     }
                // },
                {
                    test: /.ts?$/,
                    exclude: /(node_modules|bower_components|\.d\.ts$)/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.d\.ts$/,
                    loader: 'ignore-loader',
                },
                {
                    test: /\.json?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'json-loader',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                inject: true,
                // chunks: [ 'vendors', 'index' ] // nb: webpack better knows
            }),
            new MiniCssExtractPlugin({ // https://github.com/webpack-contrib/sass-loader :: In production
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: opts.isDevelopment ? 'css/[name].css' : 'css/styles.[name].[hash].css',
                chunkFilename: opts.isDevelopment ? 'css/[id].css' : 'css/styles.[id].[hash].css',
            }),
            // , // case of exporting svg as react component, to be tested
            // new webpack.LoaderOptionsPlugin({
            //     // test: /\.xxx$/, // may apply this only for some modules
            //     options: {
            //         alias: {
            //             '~scss': path.resolve(__dirname, "src", "scss"),
            //             '~js': path.resolve(__dirname, "src", "js")
            //         },
            //     }
            // })

            // * Or: To strip all locales except “en”, “es-us” and “ru”
            // * (“en” is built into Moment and can’t be removed)
            new MomentLocalesPlugin({
                localesToKeep: ['en', 'ru'],
            }),
        ],
        externals: function (context, request, callback) { // amcharts additional libraries (now useless) for data export
            if (/xlsx|canvg|pdfmake/.test(request)) {
                return callback(null, 'commonjs ' + request);
            }
            callback();
        },
    };
}

module.exports = config;
