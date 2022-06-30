module.exports = async function (globalConfig, projectConfig) {
  globalThis.__ANVIL__.kill();
};
