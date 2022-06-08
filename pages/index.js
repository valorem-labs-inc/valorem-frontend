import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import Button from "../components/button";
import connectWallet from "../lib/connectWallet";
import store from "../lib/store";

import StyledIndex from "./index.css.js";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connectingWallet: false,
      walletError: null,
    };

    this.index = React.createRef();
  }

  isCorrectNetwork = (network = "") => {
    const expectedChainId = {
      development: 4,
      production: 1,
    }[process.env.NODE_ENV];

    return expectedChainId === network?.chainId;
  };

  handleConnectWallet = () => {
    const { connectWallet, dispatch } = this.props;

    this.setState({ connectingWallet: true, walletError: null }, async () => {
      try {
        const success = await connectWallet();

        if (success) {
          this.index.current.classList.add("fade-out");
          setTimeout(() => Router.push("/vault/options"), 500);
        } else {
          this.setState({ connectingWallet: false });
        }
      } catch (exception) {
        this.setState({ connectingWallet: false });
      }
    });
  };

  render() {
    const { connectingWallet } = this.state;
    const { walletError } = this.props;

    return (
      <StyledIndex ref={this.index}>
        <img className="logo" src="/logo.png" alt="Valorem" />
        <Button
          disabled={connectingWallet}
          onClick={this.handleConnectWallet}
          theme="purple-blue"
        >
          {connectingWallet ? "Connecting..." : "Connect Wallet"}
        </Button>
        {walletError && (
          <p className="wallet-error">
            <strong>Error:</strong> {walletError}
          </p>
        )}
        <p>
          Connected wallet data is <em>only</em> stored in your browser —
          Valorem does not store this information.
        </p>
      </StyledIndex>
    );
  }
}

Index.propTypes = {};

const mapStateToProps = (state) => {
  return { walletError: state.walletError };
};

export default connect(mapStateToProps)(Index);
