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
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
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
      filename: 'style/[name].[contenthash:8].css',
      chunkFilename: 'style/[id].[contenthash:8].css',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
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
        { 
          from: 'assets', 
          to: 'assets',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        },
        { from: 'img', to: 'img' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'sw.js', to: 'sw.js' },
        { from: 'manifest.json', to: 'manifest.json' },
      ],
    }),

  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
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
              mergeRules: true,
              mergeSemantically: true,
            },
          ],
        },
      }),
    ],
  },
};