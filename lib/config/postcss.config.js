module.exports = ({ file, options, env }) => ({
  modules: true,
  exec: true,
  parser:
    ["scss", "sass", "less"].indexOf(file.extname) > -1 ? "sugarss" : false,
  plugins: [
    require("postcss-import")({}),
    require("postcss-preset-env")({}),
    require("cssnano")(
      env === "production"
        ? {
            preset: "default"
          }
        : false
    ),
    require("autoprefixer")({
      flexbox: true,
      remove: false
    })
  ]
});