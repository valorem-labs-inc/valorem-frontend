import React from "react";
import moment from "moment";
import Button from "../button";
import Warning from "../warning";
import getToken from "../../lib/getToken";
import StyledOptionModal, { OptionModalBackdrop } from "./index.css.js";
import store from "../../lib/store";
import graphql from "../../graphql/client";
import unfreezeApolloCacheValue from "../../lib/unfreezeApolloCacheValue";
import { ethers } from "ethers";
import { optionDetails as optionDetailsQuery } from "../../graphql/queries/options";

class OptionModal extends React.Component {
  state = {
    loading: false,
    optionData: null,
  };

  // TODO(Figure out how to trigger this, or otherwise get the data when coming here from an href with the option id)
  handleFetchOptionDetails = async () => {
    const state = store.getState();
    let optionId = this.props.option;
    if (optionId)
      this.setState({ loading: true }, async () => {
        console.log("getting detail");
        const state = store.getState();
        let optionId = null;
        const contractAddress =
          state?.wallet?.connection?.optionsSettlementEngineAddress;
        if (this.props?.option) {
          const tokenId = ethers.BigNumber.from(this.props?.option)._hex;
          optionId = `${contractAddress}/${tokenId}`;
        }
        const query = {
          query: optionDetailsQuery,
          skip: !state?.wallet?.connection?.accounts[0] || !optionId,
          variables: {
            account: state?.wallet?.connection?.accounts[0].toLowerCase(),
            token: optionId,
          },
        };

        const { data } = await graphql.query(query);
        const sanitizedData = unfreezeApolloCacheValue(data || []);

        this.setState({
          loading: false,
          options: sanitizedData,
        });
      });
  };

  render() {
    const { open, hide, onClose, onApprove } = this.props;
    // TODO(on this conditional we should used detail data returned from a query)
    const {
      balance,
      exerciseTimestamp,
      expiryTimestamp,
      underlyingAsset,
      underlyingAmount,
      exerciseAmount,
      exerciseAsset,
      needsApproval,
    } = this.props?.option || {};

    return (
      <>
        <OptionModalBackdrop open={open}>
          <StyledOptionModal className="option-modal">
            {hide && <i className="fas fa-xmark" onClick={onClose} />}
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Balance</h5>
                <h4>{balance}</h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Exercise Date</h5>
                <h4>{moment(exerciseTimestamp).format("MMM Do, YYYY")}</h4>
              </div>
              <div className="option-datapoint">
                <h5>Expiry Date</h5>
                <h4>{moment(expiryTimestamp).format("MMM Do, YYYY")}</h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Underlying Asset Amount</h5>
                <h4>
                  {underlyingAmount} {underlyingAsset?.symbol}{" "}
                  <span>(x {balance})</span>
                </h4>
              </div>
              <div className="option-datapoint">
                <h5>Exercise Asset Amount</h5>
                <h4>
                  {exerciseAmount} {exerciseAsset?.symbol}{" "}
                  <span>(x {balance})</span>
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
