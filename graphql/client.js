import { ApolloClient, InMemoryCache } from "@apollo/client";
import settings from "../next.config";

export default new ApolloClient({
  uri: settings.env?.subgraph?.uri,
  cache: new InMemoryCache(),
});
