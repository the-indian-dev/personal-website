const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  // Define separate entry points for your JS and CSS.
  // This allows Webpack to process them independently.
  entry: {
    main: './script/main.js',
    styles: './style/style.css',
  },
  output: {
    // Use contenthash for browser caching (cache busting).
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    // All assets will be output with hashes for caching.
    assetModuleFilename: 'asset/[name].[contenthash:8][ext]',
    clean: true, // Clean the dist folder before each build.
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // css-loader will resolve @import and url() paths in your CSS.
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // The final, optimized CSS file.
      filename: 'style/[name].[contenthash:8].css',
    }),

    // This plugin will generate the final index.html in the dist folder.
    new HtmlWebpackPlugin({
      template: './index.html', // Use your source HTML as a template.
      filename: 'index.html',
      // IMPORTANT: Inject both the final JS and CSS bundles.
      // It will automatically replace your source <link> and <script> tags.
      inject: 'body',
      chunks: ['main', 'styles'], // Specify which bundles to inject.
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

    // PurgeCSS now reliably scans your HTML for classes.
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'index.html')}`, { nodir: true }),
      // Use smart, broad regular expressions to safelist frameworks
      // instead of a fragile, hardcoded list.
      safelist: {
        standard: ['html', 'body'], // Essential for any webpage.
        deep: [
            /^is-/,      // Safelists all Bulma 'is-*' classes.
            /^has-/,     // Safelists all Bulma 'has-*' classes.
            /^fa-/,      // Safelists all Font Awesome 'fa-*' classes from the CDN.
        ],
      },
      fontFace: true, // CRITICAL: This preserves your @font-face rules.
      keyframes: true,
      variables: true,
    }),

    // Explicitly copy all asset folders that are not directly handled by CSS.
    // This is the most reliable way to ensure your assets are in the final build.
    new CopyWebpackPlugin({
      patterns: [
        { from: 'asset', to: 'asset' },     // Copies all fonts and images.
        { from: 'public', to: 'public' },   // Copies your GPG key.
        { from: 'img', to: 'img' },   // ysfhq sign
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...', // Keep default JS minimizer (Terser).
      new CssMinimizerPlugin(),
    ],
  },
};
