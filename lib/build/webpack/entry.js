const {sync} = require("glob");
const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * 获取模块文件列表
 *
 * @param {*} path
 * @param {*} pattern
 */
const queryModule = (path, pattern) => sync(resolve(path, pattern || "*"));

/**
 * entry 文件解析，并绑定 entry 对应 HTML，以最终html中 inject 对应 chunk 文件
 */
/**
 * 项目工程打包
 *
 * @param isDev
 * @param target
 * @param buildPath
 * @returns {{entry: {}, plugins: []}}
 */
const getProjectEntry = ({isDev = true, target, buildPath}) => {
  const _entry = {};
  const _entryHtmlPlugins = [];

  const _entryFiles = queryModule(target, "app.[jt]s[x]");

  _entryFiles.map(file => {
    if (/.+\/([a-zA-Z-_]+)\/app\.[jt]s[x]$/.test(file)) {
      // const _entryKey = RegExp.$1;
      const _entryKey = "app";

      _entry["app"] = file;

      _entryHtmlPlugins.push(
        new HtmlWebpackPlugin({
          filename: resolve(buildPath, `index.html`),
          template: resolve(target, `index.html`),
          chunks: ["common", "echarts", "antd", _entryKey],
          inject: true, // head, body/true, false
          hash: !isDev,
          minify: {
            removeComments: !isDev,
            collapseWhitespace: !isDev,
            removeAttributeQuotes: !isDev,
            minifyCSS: !isDev,
            minifyJS: !isDev
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          }
        })
      );
    }
  });

  return {
    entry: _entry,
    plugins: _entryHtmlPlugins
  };
};

/**
 * umd 打包
 *
 * @param isDev
 * @param target
 *
 * @returns {{entry: {}}}
 */
const getUmdEntry = ({target}) => {
  const _entry = {};

  const _entryFiles = queryModule(target, "**/index.[jt]s*");

  _entryFiles.map(file => {
    if (/.+\/([a-zA-Z-_]+)\/([a-zA-Z-_]+)\.[jt]sx?$/.test(file)) {
      const _fileKey = RegExp.$1;
      const _nameKey = RegExp.$2;

      _entry[_fileKey] = file;
    }
  });

  return {entry: _entry, plugins: []};
};

module.exports = {
  getProjectEntry,
  getUmdEntry
};
