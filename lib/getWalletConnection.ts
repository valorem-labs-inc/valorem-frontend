import { ethers } from "ethers";

import erc20ABI from "./abis/erc20";
import optionsSettlementEngineABI from "./abis/optionsSettlementEngine";
import getConfigValue from "./getConfigValue";
import { Wallet } from "./types";

const getWalletConnection = async (provider = {}) => {
  const ethersWrappedProvider = new ethers.providers.Web3Provider(provider);
  const optionsSettlementEngineAddress = getConfigValue("contract.address");
  const contract = new ethers.Contract(
    optionsSettlementEngineAddress,
    optionsSettlementEngineABI,
    ethersWrappedProvider
  );
  const erc20 = (address: string) =>
    new ethers.Contract(address, erc20ABI, ethersWrappedProvider);

  return {
    connection: ethersWrappedProvider.connection,
    ethers: ethersWrappedProvider,
    network: await ethersWrappedProvider.getNetwork(),
    accounts: await ethersWrappedProvider.listAccounts(),
    signer: await ethersWrappedProvider.getSigner(),
    gasPrice: await ethersWrappedProvider.getGasPrice(),
    optionsSettlementEngineAddress,
    contract,
    erc20,
  } as Wallet;
};

export default getWalletConnection;
