import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { analyzerPort, environment, port } from './src/configurations/settings'
import { container } from 'webpack'
import { dependencies } from './package.json'
import EsLintPlugin from 'eslint-webpack-plugin'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import dotenv from 'dotenv'
import path from 'path'
import webpack from 'webpack'

dotenv.config()

const env = environment()

module.exports = {
  mode: env,
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[contenthash].bundle.js',
    uniqueName: 'portal',
    clean: true,
    asyncChunks: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devServer: {
    https: true,
    hot: true,
    client: {
      progress: true,
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: port(),
    historyApiFallback: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new EsLintPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerPort: analyzerPort(),
      openAnalyzer: false,
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
      favicon: './public/logo.png',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new container.ModuleFederationPlugin({
      name: 'basic_authentication',
      filename: 'remoteEntry.js',
      shared: {
        ...dependencies,
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: dependencies['react-router-dom'],
        },
      },
    }),
  ],
  optimization: {
    removeEmptyChunks: true,
  },
  experiments: {
    topLevelAwait: true,
  },
}
