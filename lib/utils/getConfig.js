const { join } = require("path");
const chalk = require("chalk");
const { existsSync } = require("fs");

const errorEdit = (error) => {
  console.log(chalk.red(` >   ${error}`));
  process.exit();
};

const mappingPath = (path) => join(process.cwd(), path);

const getFile = (fileKey, name) => {
  const projectPath = mappingPath(fileKey);
  let config;

  const isExistJson = existsSync(projectPath + ".json");
  const isExistJs = existsSync(projectPath + ".config.js");

  // json
  if (!isExistJson && !isExistJs) {
    errorEdit("缺少配置文件");
  } else {
    config = require(projectPath + `${isExistJs ? ".config.js" : ".json"}`);
  }

  if (!name) return config;

  const app = config[name];

  !app && errorEdit(`缺少当前应用【${name}】配置`);

  return app;
};

// 项目模块配置
const getApp = (name) => getFile("water", name);

// 获取应用信息
const getPackageInfo = () => {
  const packageInfo = require(join(process.cwd(), "package.json"));
  return { name: packageInfo.name, version: packageInfo.version };
};

module.exports = {
  getApp,
  getPackageInfo,
  errorEdit,
};
