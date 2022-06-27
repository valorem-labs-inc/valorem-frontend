import { BigNumber } from "ethers";
import moment from "moment";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import { smartFormatCurrency } from "../../lib/currencyFormat";
import getConfigValue from "../../lib/getConfigValue";
import getToken from "../../lib/getToken";
import { Option, Wallet } from "../../lib/types";
import Button from "../button";
import StyledModal, { ModalBackdrop } from "../modal";
import Warning from "../warning";
import optionsSettlementEngineABI from "../../lib/abis/optionsSettlementEngine";

type OptionModalProps = {
  option: Option;
  balance: BigNumber;
  canExercise: boolean;
  needsApproval: boolean;
  open: boolean;
  hide: boolean;
  onClose: () => void;
  onApprove: () => void;
};

function OptionModal(props: OptionModalProps): JSX.Element {
  const {
    canExercise,
    option,
    balance,
    open,
    hide,
    needsApproval,
    onClose,
    onApprove,
  } = props;
  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const optionsSettlementEngineAddress = getConfigValue("contract.address");

  const contract = useContract({
    addressOrName: optionsSettlementEngineAddress,
    contractInterface: optionsSettlementEngineABI,
    signerOrProvider: signer,
  });

  const handleExerciseOption = useCallback(async () => {
    if (account && option && contract && signer) {
      const tx = await contract.connect(signer).exercise(option.id, balance);

      await tx.wait();
    }
  }, [account, balance, contract, option, signer]);

  const exerciseSymbol = useMemo(() => {
    if (option) {
      const token = getToken(option.exerciseAsset);
      return token?.symbol ?? "";
    }
    return "";
  }, [option]);

  const underlyingSymbol = useMemo(() => {
    if (option) {
      const token = getToken(option.underlyingAsset);
      return token?.symbol ?? "";
    }
    return "";
  }, [option]);

  // TODO(The approval button needs to work correctly)
  // TODO(The exercise button should be disabled if the present timestamp is incorrect)
  // TODO(The exercise button should be disabled if the balance is 0)
  // TODO(The exercise button should fail/be disabled if the user's balance of the exercise asset is too low)
  // TODO(The exercise button should be an approval button if the user needs to approve the exercise asset)
  // TODO: [DB] do the above by doing the logic one level higher, and sending the result via the "canExercise" prop.

  const body = useMemo(() => {
    if (!option) {
      return <></>;
    }
    const {
      exerciseAmount,
      exerciseAsset,
      exerciseTimestamp,
      expiryTimestamp,
      underlyingAmount,
      underlyingAsset,
    } = option;
    return (
      <React.Fragment>
        <div className="option-row">
          <div className="option-datapoint">
            <h5>Balance</h5>
            <h4>{balance.toNumber()}</h4>
          </div>
        </div>
        <div className="option-row">
          <div className="option-datapoint">
            <h5>Exercise Date</h5>
            <h4>{moment.unix(exerciseTimestamp).format("MMM Do, YYYY")}</h4>
          </div>
          <div className="option-datapoint">
            <h5>Expiry Date</h5>
            <h4>{moment.unix(expiryTimestamp).format("MMM Do, YYYY")}</h4>
          </div>
        </div>
        <div className="option-row">
          <div className="option-datapoint">
            <h5>Underlying Asset Amount</h5>
            <h4>
              {smartFormatCurrency(underlyingAmount, underlyingAsset)}{" "}
              {underlyingSymbol} <span>(x {balance.toNumber()})</span>
            </h4>
          </div>
          <div className="option-datapoint">
            <h5>Exercise Asset Amount</h5>
            <h4>
              {smartFormatCurrency(exerciseAmount, exerciseAsset)}{" "}
              {exerciseSymbol} <span>(x {balance.toNumber()})</span>
            </h4>
          </div>
        </div>
        <footer>
          {!needsApproval && (
            <Warning center>
              <p>
                <strong>👉</strong> Valorem charges a 0.05% fee in order to
                exercise this option.
              </p>
            </Warning>
          )}
          {needsApproval && (
            <Warning center>
              <p>
                Approval to withdraw from your account is required in order to
                use this option. Click &ldquo;Approve {exerciseSymbol}&rdquo;
                below to complete the transaction.
              </p>
            </Warning>
          )}
          {needsApproval && (
            <Button className="approve" theme="purple-blue" onClick={onApprove}>
              Approve {exerciseSymbol}
            </Button>
          )}
          {!needsApproval && (
            <Button
              disabled={!canExercise}
              theme="purple-blue"
              onClick={async () => {
                await handleExerciseOption().then(onClose);
              }}
            >
              Exercise Option
            </Button>
          )}
        </footer>
      </React.Fragment>
    );
  }, [
    option,
    balance,
    canExercise,
    handleExerciseOption,
    needsApproval,
    onApprove,
    onClose,
    underlyingSymbol,
    exerciseSymbol,
  ]);

  return (
    <ModalBackdrop open={open}>
      <StyledModal className="modal">
        {hide && <i className="fas fa-xmark" onClick={onClose} />}
        {body}
      </StyledModal>
    </ModalBackdrop>
  );
}

export default OptionModal;
