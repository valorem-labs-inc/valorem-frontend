const fs = require("fs");
const _ = require("lodash");

(async () => {
  const fetch = (await import("node-fetch")).default;

  fetch("https://tokens.coingecko.com/uniswap/all.json").then(
    async (response) => {
      const data = await response.json();
      const sanitizedData = _.uniqBy(data?.tokens, "address");
      fs.writeFileSync(
        "./lib/tokens.json",
        JSON.stringify(sanitizedData, null, 2)
      );
    }
  );
})();
