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
import { WagmiConfig, createClient, chain } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

import getConfigValue from "../lib/getConfigValue";
import StyledApp from "./_app.css";

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: [chain.mainnet, chain.rinkeby],
    }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: "Valorem Options",
        jsonRpcUrl: `https://mainnet.infura.io/v3/${getConfigValue(
          "infura.projectId"
        )}`,
      },
    }),
  ],
});

function getYear() {
  const currentYear = new Date().getFullYear();

  if (currentYear > 2022) {
    return `2022-${currentYear}`;
  }

  return currentYear;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <StyledApp>
      <Head>
        <title>Valorem Options</title>
      </Head>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
        <footer>
          <p>&copy; {getYear()}, Valorem Labs Inc. All rights reserved.</p>
        </footer>
      </WagmiConfig>
    </StyledApp>
  );
}

export default App;
