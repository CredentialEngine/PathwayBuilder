const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
  },

  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('dev'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
