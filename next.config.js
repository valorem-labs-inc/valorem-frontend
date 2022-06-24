module.exports = {
  compiler: {
    styledComponents: true,
  },
  env: {
    development: {
      contract: {
        url: "https://rinkeby.etherscan.io/address/0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
        address: "0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
      },
      network: {
        chainId: "4",
        key: "rinkeby",
        name: "Rinkeby Test Network",
      },
      subgraph: {
        uri: "https://api.studio.thegraph.com/query/29509/valorem-subgraph/v0.0.1",
      },
      infura: {
        projectId: "11b7fd47c34f4b8097cea3ffc2e215f1",
      },
    },
    production: {
      contract: {
        url: "https://rinkeby.etherscan.io/address/0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
        address: "0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
      },
      network: {
        chainId: "4",
        key: "rinkeby",
        name: "Rinkeby Test Network",
      },
      subgraph: {
        uri: "https://api.studio.thegraph.com/query/29509/valorem-subgraph/v0.0.1",
      },
      infura: {
        projectId: "11b7fd47c34f4b8097cea3ffc2e215f1",
      },
    },
  },
};
