const chalk = require("chalk");
const { join } = require("path");
const { existsSync } = require("fs");

const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const apiMocker = require("webpack-api-mocker");

const { getApp, errorEdit } = require("../utils/getConfig");

module.exports = ({ name = null } = {}) => {
  const app = getApp(name);

  !app && errorEdit("缺少当前应用的配置");

  const { host = "0.0.0.0", port = 3001 } = app;

  // 开发模式禁用外链
  app.externals = {};

  return require("./webpack/core")(
    {
      ...app,

      isDev: true,
    },
    {
      devServer: {
        contentBase: app.buildPath,
        hot: true,
        host,
        disableHostCheck: true,
        open: true,
        index: `index.html`,
        port,
        historyApiFallback: true,
        watchContentBase: true,
        watchOptions: {
          aggregateTimeout: 500,
          poll: false,
          ignored: /node_modules/,
        },
        compress: true,
        quiet: true,
        overlay: {
          warnings: false,
          errors: true,
        },
        clientLogLevel: "warning",
        stats: "errors-only",
        https: app.https || false,
        proxy: app.proxy,
        // mock api
        before: (app) => {
          const apiPath = join(process.cwd(), "api");

          existsSync(apiPath) && apiMocker(app, apiPath);
        },
        after: () => {
          console.log(chalk.yellow(`\n> 构建目录 ${app.buildPath}`));
          console.log(chalk.green(`> 服务端口监听 ${port}`));
          console.log(chalk.yellow(`> 服务正在启动...\n`));
        },
      },

      plugins: [
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Project start at http://${host}:${port}/\n`],
          },

          onErrors: function (severity, errors) {
            // You can listen to errors transformed and prioritized by the plugin
            // severity can be 'error' or 'warning'
            console.error(chalk.red(errors.toString()));
          },

          // should the console be cleared between each compilation?
          // default is true
          clearConsole: true,

          // add formatters and transformers (see below)
          additionalFormatters: [],
          additionalTransformers: [],
        }),
      ],
    }
  );
};
