const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/js/index.js',
    docs: './src/js/docs.js',
    tools: './src/js/tools.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    symlinks: false,
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: devMode ? '[name].js' : '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.yaml$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'publish/index.html'),
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'docs.html',
      template: path.resolve(__dirname, 'publish/docs.html'),
      chunks: ['react', 'docs'],
    }),
    new HtmlWebpackPlugin({
      filename: 'tools.html',
      template: path.resolve(__dirname, 'publish/tools.html'),
      chunks: ['react', 'tools'],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
  },
};
