const fs = require("fs");
const _ = require("lodash");

const HEAD = `// AUTOMATICALLY GENERATED FILE - SEE scripts/sync-coingecko-list.js
import { Token } from "./types";

const TOKEN_MAP: Record<string, Token[]> = `;

const FOOT = `;

const activeTokens = TOKEN_MAP[process.env.NODE_ENV];
if (!activeTokens) {
  console.warn("No active tokens found for environment:", process.env.NODE_ENV);
}
export default activeTokens;
`;
// make the file
(async () => {
  const fetch = (await import("node-fetch")).default;

  fetch("https://tokens.coingecko.com/uniswap/all.json").then(
    async (response) => {
      const data = await response.json();
      const sanitizedData = _.uniqBy(data?.tokens, "address");
      const fileText = `${HEAD}${JSON.stringify(
        sanitizedData,
        null,
        2
      )}${FOOT}`;
      fs.writeFileSync("./lib/tokens.ts", fileText);
    }
  );
})();
