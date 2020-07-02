const { join } = require("path");
const { existsSync } = require("fs");

const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

/**
 * 处理 antd
 * @param {antd, antdLess} antd 是否使用 antd, antdLess: antd 主题配置文件路径
 * @param {*} webpackConfig
 */
module.exports = ({ css = ["sass"], react = null }, { module, plugins }) => {
  if (!react || !react.antd) return;

  const { antd = false, antdLess = null } = react;

  let antdThemePath = "";
  let isExistAntdLess = false;

  // 检测 antd less 配置是否存在
  if (antdLess) {
    antdThemePath = join(process.cwd(), antdLess);
    isExistAntdLess = existsSync(antdThemePath);
  }

  // antd less 外部主题设置
  const lessOptions = {
    javascriptEnabled: true,
    modifyVars: !isExistAntdLess
      ? {}
      : {
          hack: `true; @import "${antdThemePath}";`,
        },
  };

  // 加载 loader 到主配置文件
  if (css.includes("less")) {
    module.rules.map((it) => {
      // 查找 是否有 less
      it.use &&
        it.use.length &&
        it.use.map((item) => {
          if (typeof item === "object" && item.loader === "less-loader") {
            item.options = { ...item.options, ...lessOptions };
          }
        });
    });
  } else {
    module.rules.push({
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: lessOptions,
        },
      ],
    });
  }

  // antd 中用 Day.js 替换 momentjs 来大幅减小打包大小
  plugins.push(new AntdDayjsWebpackPlugin());
};
