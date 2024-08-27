const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const dotenv = require('dotenv');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const env = process.env.NODE_ENV || 'dev';
console.log(`Loading environment variables from .env.${env}`); 
dotenv.config({
  path: path.resolve(__dirname, `.env.${env}`)
});

const environmentConfigs = {
  dev: {
    mode: 'development',
  },
  localEditor: {
    mode: 'development',
  },
  localViewer: {
    mode: 'development',
  },
  sandboxEditor: {
    mode: 'production',
  },
  sandboxFinder: {
    mode: 'production',
  },
  prodEditor: {
    mode: 'production',
  },
  prodFinder: {
    mode: 'production',
  },
};

const environment = environmentConfigs[env] || environmentConfigs.development;

console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL); 
console.log(`Environment used: ${env}`); 

module.exports = () => {
    return merge(commonConfig, environment, {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
          }),
        ],
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, 
                },
              },
            }),
          ],
        },
      });
    };