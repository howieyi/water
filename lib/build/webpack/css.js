const { join } = require("path");
const { excludeFile } = require("../../utils/ignore");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (
  { isDev = false, isUmd = false, css = ["sass"], vue = null },
  { module }
) => {
  // common loader
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

  vue && cssLoaders.unshift("vue-style-loader");

  // module.rules.push({
  //   test: /\.css$/,
  //   use: ["style-loader", "css-loader"],
  // });

  css.includes("sass") &&
    module.rules.push({
      test: /\.(sc|sa|c)ss$/,
      use: [...cssLoaders, "sass-loader"],
      // exclude: excludeFile,
    });

  css.includes("less") &&
    module.rules.push({
      test: /\.less$/,
      use: [
        ...cssLoaders,
        {
          loader: "less-loader",
        },
      ],
    });
};
