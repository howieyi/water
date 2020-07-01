const { join } = require("path");
const { existsSync } = require("fs");
const { excludeFile } = require("../../utils/ignore");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");

// ts 延展
module.exports = ({ antd = false }, { mode, module, plugins = [] }) => {
  const isDev = mode === "development";
  const tsConfigPath = join(process.cwd(), "tsconfig.json");

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

  module.rules.unshift(commonLoader);

  if (isDev) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        formatter: "codeframe",
      })
    );
  }
};
