import React from "react";
import Head from "next/head";
import Router from "next/router";
import { Provider as ReduxProvider } from "react-redux";
import Web3Modal from "web3modal";
import { providers } from "web3modal";

import store from "../lib/store";
import walletProviderOptions from "../lib/walletProviderOptions";
import getWalletConnection from "../lib/getWalletConnection";

import "react-datetime/css/react-datetime.css";

import "../styles/reset.css";
import "../styles/fonts.css";
import "../styles/global.css";
import "../styles/helpers.css";
import "../styles/forms.css";
import "../styles/tables.css";
import "../styles/animations.css";

import StyledApp from "./_app.css.js";

class App extends React.Component {
  state = {
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
      network: process.env.NODE_ENV === "development" ? "rinkeby" : "mainnet",
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

    const connection = await getWalletConnection(provider);

    const wallet = {
      provider,
      connection,
      web3Modal: this.web3Modal,
    };

    provider.removeAllListeners();

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log("chainChanged");

      const correctNetwork = this.isCorrectNetwork(parseInt(chainId));

      if (!correctNetwork) {
        this.handleIncorrectNetwork();
      }
    });

    if (this.isCorrectNetwork(connection.network)) {
      this.handleCorrectNetwork(wallet);
      this.setState({ ready: true });
      return true;
    } else {
      this.handleIncorrectNetwork();
      this.setState({ ready: true });
      return false;
    }
  };

  isCorrectNetwork = (network = "") => {
    const expectedChainId = {
      development: 4,
      production: 1,
    }[process.env.NODE_ENV];

    return expectedChainId === network?.chainId;
  };

  handleCorrectNetwork = (wallet) => {
    store.dispatch({ type: "CONNECT_WALLET", wallet: wallet });

    if (Router.route == "/") {
      Router.push("/vault/options");
    }
  };

  handleIncorrectNetwork = () => {
    const networkName = {
      development: "Rinkeby Test Network",
      production: "Ethereum Mainnet",
    }[process.env.NODE_ENV];

    store.dispatch({
      type: "DISCONNECT_WALLET",
      walletError: `Unsupported network. Double-check your network is ${networkName} in Metamask and try again.`,
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

App.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default App;
