const { join } = require("path");
const { existsSync } = require("fs");
const { excludeFile } = require("../../utils/ignore");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");

// ts 延展
module.exports = ({ isDev, vue, react }, { module, plugins = [] }) => {
  const tsConfigPath = join(process.cwd(), "tsconfig.json");

  const { antd = false } = react || {};

  // 没有 ts 配置文件则不启用
  if (!existsSync(tsConfigPath)) return;

  const commonLoader = {
    test: /\.tsx?$/,
    exclude: excludeFile,
    loader: "ts-loader",
    options: {
      happyPackMode: true,
      allowTsInNodeModules: true,
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: antd
          ? [
              tsImportPluginFactory({
                libraryName: "antd",
                libraryDirectory: "es",
                style: true,
              }),
            ]
          : [],
      }),
      compilerOptions: {
        module: "es2015",
        sourceMap: isDev,
      },
    },
  };

  // vue ts 后缀校验
  vue && (commonLoader.options.appendTsSuffixTo = [/\.vue$/]);

  module.rules.unshift(commonLoader);

  // ts 语法校验
  isDev &&
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        formatter: "codeframe",
      })
    );
};
