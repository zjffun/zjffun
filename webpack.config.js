import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import cjs from 'node-cjs';
import path from 'path';
import webpack from 'webpack';
import YAML from 'yaml';

const { __dirname } = cjs(import.meta);

const devMode = process.env.NODE_ENV !== 'production';

function getI18n(file) {
  return YAML.parse(
    fs.readFileSync(path.resolve(__dirname, `publish/i18n/${file}`)).toString(),
  );
}

export default {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/js/index.js',
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
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
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
      zi18n: getI18n('index.zh-CN.yaml'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.en.html',
      template: path.resolve(__dirname, 'publish/index.html'),
      chunks: ['index'],
      zi18n: getI18n('index.en.yaml'),
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
