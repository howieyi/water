const { join } = require("path");
const webpack = require("webpack");
const StyleLintPlugin = require("stylelint-webpack-plugin");

const { excludeFile } = require("../../utils/ignore");
const { getPackageInfo } = require("../../utils/getConfig");

const { getProjectEntry, getUmdEntry } = require("./extend/entry");
const useCss = require("./extend/css");
const useMarkdown = require("./extend/markdown");
const useReact = require("./extend/react");
const useVue = require("./extend/vue");
const useCopy = require("./extend/copy");
const useES = require("./extend/es");
const useTS = require("./extend/ts");
const useSplit = require("./extend/split");

module.exports = (
  {
    isUmd = false, // 是否 umd 打包
    isDev = true,
    resolvePath = "./src",
    target = "src",
    buildPath = "dist",
    publicPath = "/",
    sourceMap = true,
    copyPath = "src/public",
    css = ["sass"],
    markdown = false, // 是否支持 markdown 解析 html
    splitPackages = [],
    react = null,
    vue = null,
    getPlugins = null,
  },
  {
    loaders = [],
    plugins = [],
    devServer = {},
    externals = {}, // 禁用某些包引入bundle
    output = {},
  }
) => {
  // 打包后 chunk 名称
  // contenthash 基于内容变动改变 hash
  const _chunkName = isDev || isUmd ? "" : "[contenthash:5].";
  const _entry = isUmd
    ? getUmdEntry({ target })
    : getProjectEntry({ isDev, target, buildPath, splitPackages });

  // 修复部分组件依赖 NODE_ENV 环境变量问题
  process.env.NODE_ENV = isDev ? "development" : "production";

  const baseConfig = {
    // 缓存加速
    cache: {
      type: "filesystem",
    },

    // 环境变量配置
    // 支持 `webpack --mode=development/production`
    mode: isDev ? "development" : "production",

    devtool: isDev ? "inline-source-map" : app.sourceMap ? "source-map" : false,

    devServer,

    externals,

    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx", ".scss", ".vue", ".jsx"],
      alias: {
        "@": join(process.cwd(), resolvePath),
      },
    },

    resolveLoader: {
      // loader 包解析路径配置
      modules: [join(__dirname, "../../../node_modules")],
      extensions: [".js", ".ts", ".tsx", ".jsx", ".vue", ".json"],
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
          // exclude: excludeFile,
        },
        {
          test: /\.html$/,
          loader: "html-loader",
          exclude: excludeFile,
        },

        ...loaders,
      ],
    },

    plugins: [..._entry.plugins, ...plugins],
  };

  if (isDev) {
    // tree shaking
    baseConfig.optimization = { ...baseConfig.optimization, usedExports: true };

    baseConfig.plugins.push(
      ...[
        // 进度条
        new webpack.ProgressPlugin(),

        // 开发环境样式校验规则
        new StyleLintPlugin({
          context: target,
          configFile: join(__dirname, "../../config/.stylelintrc"),
          files: ["**/*.{vue,html,css,scss,sass}"],
        }),
      ]
    );
  }

  // 加载 css 预编译相关配置
  useCss({ isDev, isUmd, css, vue }, baseConfig);

  // 加载 markdown 配置
  useMarkdown(markdown, baseConfig);

  // 加载代码分拆配置
  useSplit({ isUmd, splitPackages }, baseConfig);

  // 加载 react 相关配置
  useReact({ css, react }, baseConfig);

  // 加载 vue 相关配置
  useVue({ isDev, vue }, baseConfig);

  // 加载 复制文件 相关配置
  useCopy(copyPath, baseConfig);

  // 加载 es 相关配置
  useES({ vue, react }, baseConfig);

  // 加载 ts 相关配置
  useTS({ isDev, vue, react }, baseConfig);

  // 加载外部 plugins
  const _plugins = getPlugins
    ? getPlugins({ isDev, ...getPackageInfo() })
    : null;
  _plugins && _plugins.length && baseConfig.plugins.push(..._plugins);

  return baseConfig;
};
