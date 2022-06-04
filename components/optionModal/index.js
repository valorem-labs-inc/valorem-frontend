import React from "react";
import moment from "moment";
import Button from "../button";
import Warning from "../warning";
import getToken from "../../lib/getToken";

import StyledOptionModal, { OptionModalBackdrop } from "./index.css.js";

class OptionModal extends React.Component {
  state = {};

  render() {
    const { open, hide, onClose, onApprove } = this.props;
    const {
      numberOfContracts,
      exerciseTimestamp,
      expiryTimestamp,
      underlyingAsset,
      underlyingAmount,
      exerciseAmount,
      exerciseAsset,
      needsApproval,
    } = this.props?.option || {};

    const underlyingAssetToken = underlyingAsset
      ? getToken(underlyingAsset)
      : null;
    const exerciseAssetToken = exerciseAsset ? getToken(exerciseAsset) : null;

    return (
      <>
        <OptionModalBackdrop open={open}>
          <StyledOptionModal className="option-modal">
            {hide && <i className="fas fa-xmark" onClick={onClose} />}
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Contracts</h5>
                <h4>{numberOfContracts}</h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Exercise From</h5>
                <h4>{moment(exerciseTimestamp).format("MMM Do, YYYY")}</h4>
              </div>
              <div className="option-datapoint">
                <h5>Expiration Date</h5>
                <h4>{moment(expiryTimestamp).format("MMM Do, YYYY")}</h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Underlying Asset</h5>
                <h4>
                  {underlyingAmount} {underlyingAssetToken?.symbol}{" "}
                  <span>(x {numberOfContracts})</span>
                </h4>
              </div>
              <div className="option-datapoint">
                <h5>Exercise Asset</h5>
                <h4>
                  {exerciseAmount} {exerciseAssetToken?.symbol}{" "}
                  <span>(x {numberOfContracts})</span>
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
                    Approval to withdraw from your account is required in order
                    to write this option. Click "Approve{" "}
                    {underlyingAssetToken?.symbol}" below to complete the
                    transaction.
                  </p>
                </Warning>
              )}
              {needsApproval && (
                <Button
                  className="approve"
                  theme="purple-blue"
                  onClick={onApprove}
                >
                  Approve {underlyingAssetToken?.symbol} &amp; Write Options
                </Button>
              )}
              {!needsApproval && (
                <Button disabled theme="purple-blue">
                  Exercise Option
                </Button>
              )}
            </footer>
          </StyledOptionModal>
        </OptionModalBackdrop>
      </>
    );
  }
}

OptionModal.defaultProps = {
  hide: true, // NOTE: Allow user to hide by default. Make this customizable for approvals.
};

OptionModal.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default OptionModal;
