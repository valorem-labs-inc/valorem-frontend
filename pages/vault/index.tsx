import Router from "next/router";
import React from "react";

type VaultProps = {
  //  none
};

class Vault extends React.Component<VaultProps> {
  componentDidMount() {
    Router.push("/vault/options");
  }

  render() {
    return <></>;
  }
}

export default Vault;
