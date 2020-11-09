/**
 * 代码拆分
 *
 * @param {*} {splitPackages} 单独拆分 chunk 包
 * @param {*} webpackConfig
 */
module.exports = ({ isUmd = false, splitPackages = [] }, webpackConfig) => {
  if (isUmd) return;

  const chunkCacheGroups = {
    vendors: {
      name: "common",
      chunks: "all",
      priority: 1,
      test({ context }) {
        if (
          splitPackages &&
          splitPackages.length &&
          /[\\/]node_modules[\\/]([a-zA-Z_-]*)[\\/]/.test(context)
        ) {
          const pac = RegExp.$1;

          return splitPackages.indexOf(pac) === -1;
        }

        return false;
      },
    },
  };

  splitPackages &&
    splitPackages.map((key) => {
      chunkCacheGroups[key] = {
        name: key,
        priority: 1,
        test: `/[\\/]node_modules[\\/]${key}[\\/]/ig`,
        chunks: "all",
      };
    });

  webpackConfig.optimization = isUmd
    ? { ...webpackConfig.optimization, minimize: false }
    : {
        ...webpackConfig.optimization,
        splitChunks: {
          automaticNameDelimiter: ".",
          chunks: "all",
          cacheGroups: chunkCacheGroups,
        },
        runtimeChunk: {
          name: "common",
        },
      };
};
