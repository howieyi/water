/**
 * 加载 markdown 相关配置
 *
 * @param {*} markdown
 * @param {*} webpackConfig Webpack 官方配置
 */
module.exports = (markdown, { module }) => {
  if (!markdown) return;

  module.rules.push({
    test: /\.md$/,
    use: [
      { loader: "html-loader" },
      {
        loader: "markdown-loader",
        options: {},
      },
    ],
  });
};
