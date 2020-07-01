// 接口前缀
const apiPrefix = "https://api.test.example.com";
// const apiPrefix = "https://api.test.example.com";

const proxyMapping = {};
// 接口 uri 前缀
const uriPrefix = ["/api"];

// 代理映射
uriPrefix.map(
  (uri) =>
    (proxyMapping[uri] = {
      target: apiPrefix,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`^${uri}`]: apiPrefix + uri,
      },
    })
);

module.exports = {
  port: 3001,
  analyzerPort: null,
  resolvePath: "src",
  target: "./src",
  publicPath: "/",
  buildPath: "./dist",
  copyPath: "./src/assets/public",
  proxy: proxyMapping,
  css: ["sass"],
  markdown: false,
  react: {
    antd: true,
    antdLess: "./src/assets/styles/antd.less",
  },
};
