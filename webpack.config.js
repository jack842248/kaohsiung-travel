'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: './js/main.js', 
        clean: true, 
    },
    devServer: {
        static: path.resolve(__dirname,'dist'),
        compress: true, //啟用gzip壓縮方式(加速)
        hot: true, //只重新加載修改的部分
        watchFiles: ['src/**/*'] //監控檔案
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.scss$/, //將原本css替換掉
                use: [
                    MiniCssExtractPlugin.loader, //將原本style-loader替換掉
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions:{
                                plugins:[
                                    ['postcss-preset-env'] //包含autoprefixer
                                ]
                            }
                        }
                    },
                    'sass-loader' //先編譯scss
                ]
            },
            {
                test: /\.js$/, //找尋js副檔名的檔案(正規表達式)
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets:['@babel/preset-env'],
                    },
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options:{
                            mozjpeg: {
                                progressive: true,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65,0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp:{
                                quality: 75,
                            }
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        //將main.js檔案引入到html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        //將main.js裡的css以獨立方式引入到html
        new MiniCssExtractPlugin({
            filename: 'css/style.css' //定義要輸出的名稱
        }),
        //全域使用jquery變數
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jquery': 'jquery'
        }),
        //複製字型和favicon檔
        new CopyWebpackPlugin({
            patterns:[
                { from: path.resolve(__dirname,'src/images/favicon') ,to: 'images/favicon' },
                { from: path.resolve(__dirname,'src/fonts') ,to: 'fonts' }
            ],
        }),
    ]
}