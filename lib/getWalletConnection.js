import { ethers } from "ethers";
import optionsSettlementEngineABI from "./abis/optionsSettlementEngine";
import erc20ABI from "./abis/erc20";

export default async (provider = {}) => {
  const ethersWrappedProvider = new ethers.providers.Web3Provider(provider);
  const contractURI = process.env.contract.address[process.env.NODE_ENV];

  return {
    _connection: ethersWrappedProvider.connection,
    ethers: ethersWrappedProvider,
    network: await ethersWrappedProvider.getNetwork(),
    accounts: await ethersWrappedProvider.listAccounts(),
    signer: await ethersWrappedProvider.getSigner(),
    gasPrice: await ethersWrappedProvider.getGasPrice(),
    optionsSettlementEngineAddress: contractURI?.address,
    contract: new ethers.Contract(
      contractURI?.address,
      optionsSettlementEngineABI,
      ethersWrappedProvider
    ),
    erc20: (address = "") => {
      return new ethers.Contract(address, erc20ABI, ethersWrappedProvider);
    },
  };
};
