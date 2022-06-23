import { Contract, providers, Signer } from "ethers";

import erc20ABI from "./abis/erc20";

export default async function getERC20Balance(
  address: string,
  account: string,
  provider: Signer
) {
  const contract = new Contract(address, erc20ABI, provider);

  return contract.balanceOf(address);
}
