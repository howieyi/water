const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
// 为模块提供中间缓存步骤
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = (app) => {
  const baseConfig = require("./webpack/core")(
    {
      isDev: false,
      ...app,
    },
    {
      plugins: [
        new CleanWebpackPlugin(),

        // new HardSourceWebpackPlugin({
        //   // 要么绝对路径或相对的WebPack的options.context。
        //   cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
        //   // 要么给予的WebPack配置对象的散列函数的字符串
        //   configHash: function(webpackConfig) {
        //     // 对NPM节点对象的散列可用于构建本。
        //     return process.env.NODE_ENV + '-' + process.env.BABEL_ENV;
        //   },
        //   // 对象或项目哈希函数
        //   environmentHash: {
        //     root: process.cwd(),
        //     directories: [],
        //     files: ['package-lock.json', 'yarn.lock'],
        //   },
        //   info: {
        //     // 'none' or 'test'.
        //     mode: 'none',
        //     // 'debug', 'log', 'info', 'warn', or 'error'.
        //     level: 'debug',
        //   },
        //   // 自动清除大型缓存.
        //   cachePrune: {
        //     // 不考虑将小于maxAge的缓存删除。他们必须//至少是这个（默认值：2天）以毫秒为单位。
        //     maxAge: 2 * 24 * 60 * 60 * 1000,
        //     // 所有高速缓存一起必须大于`sizeThreshold`较大任何之前//缓存将被删除。它们在一起的字节数必须至少等于//（默认值：50 MB）。
        //     sizeThreshold: 50 * 1024 * 1024
        //   }
        // }),

        // 把所有的样式都合并到一个文件
        new MiniCssExtractPlugin({
          filename: `static/styles/[name].[contenthash:5].css`,
          chunkFilename: `static/styles/[name].[contenthash:5].css`,
        }),
      ],
    }
  );

  // 压缩
  baseConfig.optimization.minimize = true;
  baseConfig.optimization.minimizer = [
    // 压缩打包的文件
    new TerserWebpackPlugin({
      cache: false,
      parallel: true, // 启用并行化
      sourceMap: false,
      terserOptions: {
        ie8: true,
        safari10: true,
        ecma: 5,
        warnings: false,
        compress: {
          drop_debugger: true,
          drop_console: true,
        },
        output: {
          comments: false,
        },
      },
    }),
  ];

  // 代码打包模块分析
  app.analyzerPort &&
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: app.analyzerPort,
      })
    );

  return baseConfig;
};
