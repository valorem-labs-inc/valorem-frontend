module.exports = {
  compiler: {
    styledComponents: true,
  },
  env: {
    contract: {
      address: {
        development: {
          url: "https://rinkeby.etherscan.io/address/0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA",
          address: "0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA",
        },
        production: {
          url: "https://rinkeby.etherscan.io/address/0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
          address: "0xB6645D6C55Ff3511af0Cbb24009b2635ba9A23DE",
        },
      },
    },
    subgraph: {
      uri: "https://api.studio.thegraph.com/query/13157/valorem/0.0.3",
    },
    infura: {
      projectId: "11b7fd47c34f4b8097cea3ffc2e215f1",
    },
  },
};
