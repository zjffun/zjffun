const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HTMLPlugin = require('html-webpack-plugin');
const DirectoryTreePlugin = require('directory-tree-webpack-plugin');
const HTMLTemplate = require('html-webpack-template');
const common = require('./webpack.common.js');
const { enhance, filter, sort } = require('./src/utilities/content-tree-enhancers.js');

module.exports = env => merge(common(env), {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({
      inject: false,
      template: HTMLTemplate,
      title: 'zjffun',
      appMountId: 'root',
      mobile: true,
      favicon: './favicon.ico',
      meta: {
        description: '...'
      }
    }),
    new DirectoryTreePlugin({
      dir: 'src/blogs',
      path: 'src/blogs/_blogs.json',
      extensions: /\.mdx?/,
      enhance,
      filter,
      sort
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
    hot: true,
    inline: true,
    compress: true,
    historyApiFallback: true
  }
});
