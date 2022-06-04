import React from "react";
import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import StyledVault from "./index.css.js";
import Breadcrumbs from "../../components/breadcrumbs/index.js";
import Button from "../../components/button/index.js";

class Vault extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "",
    };
    this.vault = React.createRef();
  }

  componentDidMount() {
    document.body.classList.add("is-internal");

    const { wallet } = this.props;
    const account = wallet?.connection?.accounts[0];

    this.setState({
      path: Router.asPath,
      account: `${account?.substring(0, 8)}...${account?.substring(34, 42)}`,
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

Vault.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default connect((state) => {
  return state;
})(Vault);
