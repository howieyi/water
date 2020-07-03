const {
  readdirSync,
  readFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
} = require("fs");
const { join } = require("path");

// 忽略文件
const ignoreFiles = [
  "node_modules",
  ".DS_Store",
  "dist",
  "yarn.lock",
  "package-lock.json",
];

/**
 * 复制文件夹
 *
 * @param {*} fromPath 源路径
 * @param {*} toPath 目的路径
 */
const copyFolder = (fromPath, toPath) => {
  if (!existsSync(fromPath)) return;

  // 不存在目的路径，则新建
  !existsSync(toPath) && mkdirSync(toPath);

  const files = readdirSync(fromPath, { withFileTypes: true });

  for (let file of files) {
    if (ignoreFiles.includes(file.name)) continue;

    const fromFilePath = join(fromPath, file.name);
    const toFilePath = join(toPath, file.name);

    if (file.isFile()) {
      // 复制
      const reader = createReadStream(fromFilePath);
      const writer = createWriteStream(toFilePath);
      reader.pipe(writer);
    } else {
      copyFolder(fromFilePath, toFilePath);
    }
  }
};

module.exports = {
  copyFolder,
};
