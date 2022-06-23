import { Contract, Signer } from "ethers";

import erc20ABI from "./abis/erc20";

export async function handleApproveToken(
  asset: string,
  spender: string,
  signer: Signer,
  callback?: (response: any) => void
): Promise<void> {
  const erc20Instance = new Contract(asset, erc20ABI, signer);

  if (!erc20Instance) {
    console.warn(`No erc20 instance for "${asset}" - no approval possible`);
    return;
  }

  const approvalTransaction = await erc20Instance.approve(
    spender,
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  );

  return approvalTransaction.wait().then((approvalResponse) => {
    // this.setState({ needsApproval: false }, );
    if (callback) {
      return callback(approvalResponse);
    }
    return approvalResponse;
  });
}
