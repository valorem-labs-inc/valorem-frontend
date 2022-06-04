import React from "react";
import Router from "next/router";

class Vault extends React.Component {
  state = {};

  componentDidMount() {
    Router.push("/vault/options");
  }

  render() {
    return <></>;
  }
}

Vault.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Vault;
