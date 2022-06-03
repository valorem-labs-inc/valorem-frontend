module.exports = {
  compiler: {
    styledComponents: true,
  },
  env: {
    contract: {
      address: {
        development: {
          url: 'https://rinkeby.etherscan.io/address/0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA',
          address: '0xB79DDbEc890fdE9A993e3C8C57e27629E2217AAA'
        },
      },
    },
    subgraph: {
      uri: 'https://api.studio.thegraph.com/query/13157/valorem-options/0.0.15',
    },
    infura: {
      projectId: '11b7fd47c34f4b8097cea3ffc2e215f1',
    },
  },
};
