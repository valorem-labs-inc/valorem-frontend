import { ApolloClient, InMemoryCache } from "@apollo/client";

import getConfigValue from "../lib/getConfigValue";
import settings from "../next.config";

export default new ApolloClient({
  uri: getConfigValue("subgraph.uri"),
  cache: new InMemoryCache(),
});
