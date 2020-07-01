const { join } = require("path");
const { existsSync } = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (copyPath, webpackConfig) => {
  const _copyPath = join(process.cwd(), copyPath);

  // 有文件可复制
  if (existsSync(_copyPath) && sync(join(_copyPath), "*")) {
    webpackConfig.plugins.push(
      // 转移公共文件
      new CopyWebpackPlugin(
        [
          {
            from: _copyPath,
            to: ".",
            cache: true,
            flatten: true,
            force: true,
          },
        ],
        {
          copyUnmodified: true,
          ignore: ["*.md", "*.css", "*.scss", ".DS_Store", "*.ts", ".gitkeep"],
        }
      )
    );
  }
};
