import "react-datetime/css/react-datetime.css";

import "../styles/reset.css";
import "../styles/fonts.css";
import "../styles/global.css";
import "../styles/helpers.css";
import "../styles/forms.css";
import "../styles/tables.css";
import "../styles/animations.css";

import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import StyledApp from "./_app.css";
import { useApollo } from "../graphql/client";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function getYear() {
  const currentYear = new Date().getFullYear();

  if (currentYear > 2022) {
    return `2022-${currentYear}`;
  }

  return currentYear;
}

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={client}>
        <StyledApp>
          <Head>
            <title>Valorem Options</title>
          </Head>
          <Component {...pageProps} />
          <footer>
            <p>&copy; {getYear()}, Valorem Labs Inc. All rights reserved.</p>
          </footer>
        </StyledApp>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default App;
