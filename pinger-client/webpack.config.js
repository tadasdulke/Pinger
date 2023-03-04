const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      '@Config': path.resolve(__dirname, 'src/config'),
      '@Common': path.resolve(__dirname, 'src/common'),
      '@Api': path.resolve(__dirname, 'src/api'),
      '@Store': path.resolve(__dirname, 'src/store'),
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Router': path.resolve(__dirname, 'src/router'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  devServer: {
    allowedHosts: 'all',
    historyApiFallback: true,
  },
};
