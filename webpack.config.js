const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: {
    main: './js/script.js',
    styles: ['./style/style.css', './style/bulma.min.css']
  },
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder before each build
  },
  mode: 'production', // Use production mode for minification and optimizations
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: true, // Inject assets automatically
      scriptLoading: 'blocking',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, '**/*')}`, { nodir: true }),
      safelist: {
        standard: ['html', 'body', /^uil-/, 'is-mobile', /^page-/, /^section/, 'hello', 'title', 'level-left', 'level', 'waving-hand', 'top'],
        deep: [/typed/, /social-media/, /level/, /bulma/, /hello/, /waving/, /title/],
        greedy: [/title$/, /level$/, /hello$/, /emoji$/, /hand$/, /^span/],
      },
      fontFace: true,
      keyframes: true,
      variables: true,
      rejected: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'img', to: 'img' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      '...', // Keep default JS minimizer (Terser)
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              cssDeclarationSorter: true,
              mergeRules: false,
              mergeSemantically: false,
            },
          ],
        },
      }),
    ],
  },
};