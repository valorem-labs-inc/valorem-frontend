module.exports = {
  compiler: {
    styledComponents: true,
  },
  env: {
    development: {
      contract: {
        url: "https://rinkeby.etherscan.io/address/0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA",
        address: "0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA",
      },
      network: {
        chainId: "4",
        key: "rinkeby",
        name: "Rinkeby Test Network",
      },
      subgraph: {
        uri: "https://api.studio.thegraph.com/query/13157/valorem/0.0.3",
      },
      infura: {
        projectId: "11b7fd47c34f4b8097cea3ffc2e215f1",
      },
    },
    production: {
      contract: {
        url: "",
        address: "",
      },
      network: {
        chainId: 1,
        key: "mainnet",
        name: "Ethereum Mainnet",
      },
      subgraph: {
        uri: "https://api.studio.thegraph.com/query/13157/valorem/0.0.3",
      },
      infura: {
        projectId: "11b7fd47c34f4b8097cea3ffc2e215f1",
      },
    },
  },
};
