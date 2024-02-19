exports.excludeFile = file => {
  if (!file) return false;

  return file.match(/node_modules/) || file.match(/compressor\.js$/) || file.match(/qrcode\.js$/);
};
