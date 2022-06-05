import store from "./store";

export async function checkIfHasRequiredBalance (
    asset,
    amount,
    numberOfContracts
) {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const erc20Instance = erc20(asset);
    const underlyingAssetBalance = await erc20Instance.balanceOf(
        state?.wallet?.connection?.accounts[0]
    );
    const totalUnderlyingAmount = amount * numberOfContracts;

    return underlyingAssetBalance > totalUnderlyingAmount;
}

export async function checkIfHasAllowance (
    asset,
) {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const erc20Instance = erc20(asset);
    const allowanceResponse = await erc20Instance.allowance(
        state?.wallet?.connection?.accounts[0],
        state?.wallet?.connection?.optionsSettlementEngineAddress
    );

    // TODO(This should check not just that it's gt 0, but greater than the actual amount required)
    return allowanceResponse?._hex !== "0x00";
};

export async function handleApproveToken (
    asset,
    callback = null
) {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const optionsSettlementEngineAddress =
        state?.wallet?.connection?.optionsSettlementEngineAddress;
    const erc20Instance = erc20(asset);
    const erc20InstanceWithSigner = erc20Instance
        ? erc20Instance.connect(this.connection.signer)
        : null;
    const approvalTransaction = await erc20InstanceWithSigner.approve(
        optionsSettlementEngineAddress,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    );

    return approvalTransaction.wait().then((approvalResponse) => {
        this.setState({ needsApproval: false }, callback);
    });
};