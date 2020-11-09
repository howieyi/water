const { join } = require("path");
const { excludeFile } = require("../../../utils/ignore");

// es 延展
module.exports = ({ vue }, { module }) => {
  const commonLoader = {
    test: /\.jsx?$/,
    loader: "babel-loader",
    exclude: excludeFile,
    options: {
      sourceMaps: true,
      babelrc: true,
      // cacheDirectory: true,
      configFile: join(
        __dirname,
        `../../../config/${vue ? "vue" : "react"}.babelrc`
      ),
    },
  };

  module.rules.push(commonLoader);
};
