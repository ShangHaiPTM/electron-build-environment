/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';

let defaultExt = ['.js', '.jsx', '.json'];
if (process.env.NODE_ENV === 'production') {
  defaultExt = ['.prod.js', '.prod.jsx', ...defaultExt];
} else {
  defaultExt = ['.dev.js', '.dev.jsx', ...defaultExt];
}

export default {

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    }]
  },

  output: {
    path: path.join(__dirname, 'app'),
    filename: 'renderer.dev.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: defaultExt,
    modules: [
      path.join(__dirname, 'app'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.SERVER_PATH': JSON.stringify('http://localhost:3000')
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
