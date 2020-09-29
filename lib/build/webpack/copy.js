const { join } = require("path");
const { existsSync } = require("fs");
const { sync } = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (copyPath, webpackConfig) => {
  const _copyPath = join(process.cwd(), copyPath);

  // 有文件可复制
  if (existsSync(_copyPath) && sync(join(_copyPath), "*")) {
    webpackConfig.plugins.push(
      // 转移公共文件
      new CopyWebpackPlugin({
        patterns: [
          {
            from: _copyPath,
            to: ".",
            cacheTransform: true,
            flatten: false, // 文件是否平铺到最外层
            force: true,
          },
        ]
      })
    );
  }
};
