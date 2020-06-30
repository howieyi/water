exports.excludeFile = file => {
  if (!file) return false;

  return file.match(/node_modules/);
};
