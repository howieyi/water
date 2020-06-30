const {excludeFile} = require("../../utils/ignore");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");

// ts 延展
module.exports = ({mode, module, plugins = []}) => {
  const isDev = mode === "development";

  const commonLoader = {
    test: /\.tsx?$/,
    exclude: excludeFile,
    loader: "ts-loader",
    options: {
      happyPackMode: true,
      allowTsInNodeModules: true,
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: [
          tsImportPluginFactory({
            libraryName: "antd",
            libraryDirectory: "es",
            style: true
          })
        ]
      }),
      compilerOptions: {
        module: "es2015",
        sourceMap: isDev
      }
    }
  };

  module.rules.unshift(commonLoader);

  if (isDev) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        formatter: "codeframe"
      })
    );
  }
};
