import React from "react";
import Head from "next/head";
import Router from "next/router";
import { Provider as ReduxProvider } from "react-redux";
import Web3Modal from "web3modal";

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
  state = {};

  componentDidMount() {
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

    store.dispatch({ type: "CONNECT_WALLET", wallet: wallet });

    if (Router.route == "/") {
      Router.push("/vault/options");
    }
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
        <ReduxProvider store={store}>
          <Component connectWallet={this.connectWallet} {...pageProps} />
        </ReduxProvider>
        <footer>
          <p>&copy; {this.year()}, Valorem Labs Inc. All rights reserved.</p>
        </footer>
      </StyledApp>
    );
  }
}

App.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default App;
