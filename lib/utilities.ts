import { BigNumber } from "ethers";

import store, { SiteStore } from "./store";

export async function checkIfHasRequiredBalance(
  asset: string,
  amountInWei: BigNumber,
  numberOfContracts: BigNumber
): Promise<boolean> {
  const { wallet }: SiteStore = store.getState();
  if (!wallet) {
    console.warn("No wallet connected");
    return false;
  }
  const erc20Instance = wallet.erc20(asset);
  const underlyingAssetBalance: BigNumber = await erc20Instance.balanceOf(
    wallet.accounts[0]
  );
  const totalUnderlyingAmount = amountInWei.mul(numberOfContracts);

  return underlyingAssetBalance.gte(totalUnderlyingAmount);
}

export async function checkIfHasAllowance(
  asset: string,
  requiredAmountInWei?: BigNumber
): Promise<boolean> {
  const { wallet }: SiteStore = store.getState();
  if (!wallet) {
    console.warn("No wallet connected");
    return false;
  }
  const erc20Instance = wallet.erc20(asset);
  if (!erc20Instance) {
    console.warn(`No erc20 instance for "${asset}" - no allowance check`);
    return false;
  }
  const allowanceResponse: BigNumber = await erc20Instance.allowance(
    wallet.accounts[0],
    wallet.optionsSettlementEngineAddress
  );

  return (
    allowanceResponse &&
    allowanceResponse.gt(requiredAmountInWei ?? BigNumber.from(0))
  );
}

export async function handleApproveToken(
  asset: string,
  callback?: (response: any) => void
): Promise<void> {
  const state: SiteStore = store.getState();
  const { wallet } = state;

  if (!wallet) {
    console.warn("No wallet connected");
    return;
  }

  const erc20Instance = wallet.erc20(asset);

  if (!erc20Instance) {
    console.warn(`No erc20 instance for "${asset}" - no approval possible`);
    return;
  }
  const erc20InstanceWithSigner = erc20Instance.connect(wallet.signer);

  const approvalTransaction = await erc20InstanceWithSigner.approve(
    wallet.optionsSettlementEngineAddress,
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
