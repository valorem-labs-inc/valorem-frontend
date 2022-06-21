import "react-datetime/css/react-datetime.css";

import "../styles/reset.css";
import "../styles/fonts.css";
import "../styles/global.css";
import "../styles/helpers.css";
import "../styles/forms.css";
import "../styles/tables.css";
import "../styles/animations.css";

import Head from "next/head";
import Router from "next/router";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import Web3Modal from "web3modal";
import { providers } from "web3modal";

import getConfigValue from "../lib/getConfigValue";
import getWalletConnection from "../lib/getWalletConnection";
import store from "../lib/store";
import walletProviderOptions from "../lib/walletProviderOptions";
import StyledApp from "./_app.css";

type AppProps = {
  Component: React.ComponentType<any>;
  pageProps: any;
};

type AppState = {
  ready: boolean;
}

class App extends React.Component<AppProps, AppState> {
  web3Modal: Web3Modal;

  state: AppState = {
    ready: false,
  };

  componentDidMount() {
    if (!(window.web3 || window.ethereum)) {
      walletProviderOptions["custom-metamask"] = {
        display: {
          logo: providers.METAMASK.logo,
          name: "Install MetaMask",
          description: "Connect using browser wallet",
        },
        package: {},
        connector: async () => {
          window.open("https://metamask.io");
          throw new Error("MetaMask not installed");
        },
      };
    }

    this.web3Modal = new Web3Modal({
      network: getConfigValue("network.key"),
      providerOptions: walletProviderOptions,
      cacheProvider: true,
    });

    if (this.web3Modal.cachedProvider) {
      this.connectWallet();
    } else {
      const state = store.getState();

      if (!state.wallet) {
        Router.push("/");
      }

      this.setState({ ready: true });
    }
  }

  connectWallet = async () => {
    const provider = await this.web3Modal.connect();

    const wallet = await getWalletConnection(provider);

    provider.removeAllListeners();

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log("chainChanged");

      const correctNetwork = this.isCorrectNetwork(parseInt(chainId));

      if (!correctNetwork) {
        this.handleIncorrectNetwork();
      }
    });

    if (this.isCorrectNetwork(wallet.network.chainId)) {
      this.handleCorrectNetwork(wallet);
      this.setState({ ready: true });
      return true;
    } else {
      this.handleIncorrectNetwork();
      this.setState({ ready: true });
      return false;
    }
  };

  isCorrectNetwork = (chainId: number = -1) => {
    return chainId === parseInt(getConfigValue("network.chainId"));
  };

  handleCorrectNetwork = (wallet) => {
    store.dispatch({ type: "CONNECT_WALLET", wallet });

    if (Router.route == "/") {
      Router.push("/vault/options");
    }
  };

  handleIncorrectNetwork = () => {
    const networkName = getConfigValue("network.name");
    store.dispatch({
      type: "DISCONNECT_WALLET",
      walletError: `Unsupported network. Double-check your network is Rinkeby in Metamask and try again.`,
    });

    Router.push("/");
  };

  year = () => {
    const currentYear = new Date().getFullYear();

    if (currentYear > 2022) {
      return `2022-${currentYear}`;
    }

    return currentYear;
  };

  render() {
    const { Component, pageProps } = this.props;

    return (
      <StyledApp>
        <Head>
          <title>Valorem Options</title>
        </Head>
        {this.state.ready && (
          <>
            <ReduxProvider store={store}>
              <Component connectWallet={this.connectWallet} {...pageProps} />
            </ReduxProvider>
            <footer>
              <p>
                &copy; {this.year()}, Valorem Labs Inc. All rights reserved.
              </p>
            </footer>
          </>
        )}
      </StyledApp>
    );
  }
}

export default App;
