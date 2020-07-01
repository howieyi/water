const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = (app) => {
  const baseConfig = require("./webpack/core")(
    {
      isDev: false,
      isUmd: true,
      ...app,
    },
    {
      // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
      externals: app.externals,
      output: {
        libraryTarget: "umd",
      },

      lang: app.lang || "ts",

      plugins: [new CleanWebpackPlugin()],
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
