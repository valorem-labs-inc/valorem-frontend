const { spawn } = require("child_process");

module.exports = function (globalConfig, projectConfig) {
  return new Promise((resolve, reject) => {
    const anvil = spawn("anvil", [
      "--fork-url",
      "https://eth-rinkeby.alchemyapi.io/v2/0LQUqcSj0Cb2EMlIg8533A0L3kxoGA7h",
      "--fork-block-number",
      "10910707",
    ]);

    anvil.stdout.on("data", (data) => {
      resolve();
    });

    anvil.stderr.on("data", (data) => {
      reject(data);
    });

    globalThis.__ANVIL__ = anvil;
  });
};
