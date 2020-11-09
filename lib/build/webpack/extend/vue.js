const { excludeFile } = require("../../../utils/ignore");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = ({ isDev, vue }, { resolve, module, plugins }) => {
  if (!vue) return;

  // vue resolve
  resolve.alias["vue$"] = isDev ? "vue/dist/vue.esm.js" : "vue/dist/vue.min.js";

  // vue-loader
  module.rules.push({
    test: /\.vue$/,
    loader: "vue-loader",
    exclude: excludeFile,
  });

  // vue plugin
  plugins.push(new VueLoaderPlugin());
};
