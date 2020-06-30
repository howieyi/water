const { join } = require("path");
const webpack = require("webpack");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

const { sync } = require("glob");
const { existsSync } = require("fs");
const { excludeFile } = require("../../utils/ignore");
const { getProjectEntry, getUmdEntry } = require("./entry");

module.exports = ({
  isUmd = false, // 是否 umd 打包
  isDev = true,
  isNeedAntd = false,
  resolvePath = "./src",
  target = "src",
  themePath = "src/assets/styles/antd.less",
  buildPath = "dist",
  publicPath = "/",
  copyPath = "src/public",
  loaders = [],
  plugins = [],
  devServer = {},
  externals = {}, // 禁用某些包引入bundle
  output = {},
}) => {
  // 打包后 chunk 名称
  // contenthash 基于内容变动改变 hash
  const _chunkName = isDev || isUmd ? "" : "[contenthash:5].";
  const _entry = isUmd
    ? getUmdEntry({ target })
    : getProjectEntry({ isDev, target, buildPath });

  // 修复部分组件依赖 NODE_ENV 环境变量问题
  process.env.NODE_ENV = isDev ? "development" : "production";

  const cssLoaders = [
    isDev || isUmd ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap: isDev,
        modules: false,
        importLoaders: 1,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: isDev,
        config: {
          path: join(__dirname, "../../config/"),
        },
      },
    },
  ];

  const antdThemePath = join(process.cwd(), themePath);
  const isExistAntdLess = existsSync(antdThemePath);

  isNeedAntd &&
    loaders.push({
      test: /\.less$/,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader", // translates CSS into CommonJS
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true,
            modifyVars: !isExistAntdLess
              ? {}
              : {
                  hack: `true; @import "${antdThemePath}";`,
                },
          },
        },
      ],
    });

  const baseConfig = {
    // 缓存加速
    cache: {
      type: "filesystem",
    },

    // 环境变量配置
    // 支持 `webpack --mode=development/production`
    mode: isDev ? "development" : "production",

    devtool: isDev ? "inline-source-map" : false,

    devServer,

    externals,

    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx", ".scss"],
      alias: {
        "@": join(process.cwd(), resolvePath),
      },
    },

    resolveLoader: {
      // loader 包解析路径配置
      modules: [join(__dirname, "../../../node_modules")],
    },

    // 模块配置入口
    // string|Array<string>
    // {[entryChunkName: string]: string|Array<string>}
    entry: _entry.entry,

    // 模块输出配置
    output: {
      path: join(process.cwd(), buildPath),
      publicPath: publicPath,
      filename: isUmd
        ? "[name]/index.js"
        : `static/scripts/[name].${_chunkName}js`,
      sourceMapFilename: isUmd
        ? "[name]/index.map"
        : `static/scripts/[name].${_chunkName}map`,
      chunkFilename: isUmd
        ? "[name]/[name].js"
        : `static/scripts/[name].${_chunkName}js`,
      ...output,
    },

    optimization: isUmd
      ? {
          minimize: false,
        }
      : {
          splitChunks: {
            automaticNameDelimiter: ".",
            chunks: "all",
            cacheGroups: {
              antd: {
                name: "antd", // 单独将 elementUI 拆包
                priority: 1,
                test: /[\\/]node_modules[\\/]antd[\\/]/,
                chunks: "all",
              },
              echarts: {
                name: "echarts", // 单独将 echarts 拆包
                priority: 1,
                test: /[\\/]node_modules[\\/]echarts[\\/]/,
                chunks: "all",
              },
              vendors: {
                name: "common",
                chunks: "all",
                priority: 1,
                test({ context }) {
                  if (
                    /[\\/]node_modules[\\/]([a-zA-Z_-]*)[\\/]/.test(context)
                  ) {
                    const pac = RegExp.$1;
                    return (
                      ["antd", "echarts", "element-ui"].indexOf(pac) === -1
                    );
                  }
                  return false;
                },
              },
            },
          },
          runtimeChunk: {
            name: "common",
          },
        },

    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|svg|ico)$/,
          loader: "file-loader",
          options: {
            name: `[name].[ext]${isDev ? "" : "?" + _chunkName}`,
            useRelativePath: false,
            outputPath: "static/images",
          },
          exclude: excludeFile,
        },
        {
          test: /\.html$/,
          loader: "html-loader",
          exclude: excludeFile,
        },
        {
          test: /\.(sc|sa|c)ss$/,
          use: [...cssLoaders, "sass-loader"],
          exclude: excludeFile,
        },
        {
          test: /\.md$/,
          use: [
            { loader: "html-loader" },
            {
              loader: "markdown-loader",
              options: {},
            },
          ],
        },

        ...loaders,
      ],
    },

    plugins: [
      // antd 中用 Day.js 替换 momentjs 来大幅减小打包大小
      ...(isNeedAntd ? [new AntdDayjsWebpackPlugin()] : []),

      ..._entry.plugins,

      ...plugins,
    ],
  };

  const _copyPath = join(process.cwd(), copyPath);

  // 有文件可复制
  if (existsSync(_copyPath) && sync(join(_copyPath), "*")) {
    baseConfig.plugins.push(
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

  if (isDev) {
    // tree shaking
    baseConfig.optimization.usedExports = true;

    baseConfig.plugins.push(
      ...[
        // 进度条
        new webpack.ProgressPlugin(),

        // 开发环境样式校验规则
        new StyleLintPlugin({
          context: target,
          configFile: join(__dirname, "../../config/.stylelintrc"),
          files: ["**/*.{html,css,scss,sass}"],
        }),
      ]
    );
  }

  // 引入 es 相关配置
  require("./es")(baseConfig);

  // 引入 ts 相关配置
  require("./ts")(baseConfig);

  return baseConfig;
};
