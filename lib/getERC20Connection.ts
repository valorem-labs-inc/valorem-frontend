import { ethers } from "ethers";

import erc20ABI from "./abis/erc20";
import optionsSettlementEngineABI from "./abis/optionsSettlementEngine";
import getConfigValue from "./getConfigValue";
import type { Wallet } from "./types";

const getERC20Connection = async (provider = {}) => {
  const jsonRPCProvider = new ethers.providers.Web3Provider(provider);
  const optionsSettlementEngineAddress = getConfigValue(
    "contract.address",
    "unknown"
  );

  const optionsSettlementEngine = new ethers.Contract(
    optionsSettlementEngineAddress,
    optionsSettlementEngineABI,
    jsonRPCProvider
  );

  return {
    connection: jsonRPCProvider.connection,
    ethers: jsonRPCProvider,
    network: await jsonRPCProvider.getNetwork(),
    accounts: await jsonRPCProvider.listAccounts(),
    signer: await jsonRPCProvider.getSigner(),
    jsonRPCProvider,
    gasPrice: await jsonRPCProvider.getGasPrice(),
    contract: optionsSettlementEngine,
    optionsSettlementEngineAddress,
    erc20: (address: string) =>
      new ethers.Contract(address, erc20ABI, jsonRPCProvider),
  } as Wallet;
};

export default getERC20Connection;
