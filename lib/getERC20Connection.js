import { ethers } from "ethers";
import optionsSettlementEngineABI from "./abis/optionsSettlementEngine";

export default async (provider = {}) => {
  const jsonRPCProvider = new ethers.providers.Web3Provider(provider);
  const optionsSettlementEngineAddress =
    process.env.contract.address[process.env.NODE_ENV];
  const optionsSettlementEngine = new ethers.Contract(
    optionsSettlementEngineAddress,
    optionsSettlementEngineABI,
    jsonRPCProvider
  );

  return {
    _connection: jsonRPCProvider.connection,
    ethers: jsonRPCProvider,
    network: await jsonRPCProvider.getNetwork(),
    accounts: await jsonRPCProvider.listAccounts(),
    signer: await jsonRPCProvider.getSigner(),
    jsonRPCProvider,
    gasPrice: await jsonRPCProvider.getGasPrice(),
    contract: optionsSettlementEngine,
    erc20: new ethers.Contract(contractURI?.address, erc20ABI, jsonRPCProvider),
  };
};
