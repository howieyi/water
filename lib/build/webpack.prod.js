const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = (app) => {
  const baseConfig = require("./webpack/core")(
    {
      isDev: false,
      ...app,
    },
    {
      plugins: [
        new CleanWebpackPlugin(),

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
      sourceMap: app.sourceMap || false,
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
