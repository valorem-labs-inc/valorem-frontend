import Link from "next/link";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";

import Breadcrumbs from "../../components/breadcrumbs";
import Button from "../../components/button";
import { Wallet } from "../../lib/types";
import StyledVault from "./index.css";

type VaultState = {
  path: string;
  account: string;
};

type VaultProps = {
  children: React.ReactNode;
  wallet: Wallet;
};

class Vault extends React.Component<VaultProps, VaultState> {

  private vault = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {
      path: "",
      account: "",
    } as VaultState;
  }

  componentDidMount() {
    document.body.classList.add("is-internal");

    const { wallet } = this.props;
    const account = wallet?.accounts ? wallet.accounts[0] : "";

    this.setState({
      path: Router.asPath,
      account: account ? `${account?.substring(0, 8)}...${account?.slice(-8)}` : "~",
    });
  }

  componentWillUnmount() {
    document.body.classList.remove("is-internal");
  }

  handleDisconnectWallet = () => {
    Router.push("/");
  };

  render() {
    const { children } = this.props;
    const { path, account } = this.state;

    return (
      <StyledVault ref={this.vault}>
        <div className="vault-content">
          <aside>
            <div className="connected-account">
              <div>
                <header>
                  <h5>Connected As</h5>
                  <p>{account}</p>
                </header>
                <Button
                  theme="purple-blue"
                  onClick={this.handleDisconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            </div>
            <ul>
              <li className={path.includes("/vault/options") ? "active" : ""}>
                <Link href="/vault/options">Options</Link>
                <div className="icon">
                  <i className="fas fa-link" />
                </div>
                <header>
                  <h4>Options</h4>
                  <p>Write and manage your options.</p>
                </header>
              </li>
              <li className={path.includes("/vault/claims") ? "active" : ""}>
                <Link href="/vault/claims">Claims</Link>
                <div className="icon">
                  <i className="fas fa-receipt" />
                </div>
                <header>
                  <h4>Claims</h4>
                  <p>View and redeem your claims.</p>
                </header>
              </li>
            </ul>
          </aside>
          <main>
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </StyledVault>
    );
  }
}

export default connect((state) => {
  return state;
})(Vault);
