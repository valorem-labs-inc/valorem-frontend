import React from "react";
import moment from "moment";
import { ethers } from "ethers";
import Link from "next/link";
import Button from "../button";
import StyledModal, { ModalBackdrop } from "../modal";
import graphql from "../../graphql/client";
import { optionDetails as optionDetailsQuery } from "../../graphql/queries/options";
import store from "../../lib/store";
import unfreezeApolloCacheValue from "../../lib/unfreezeApolloCacheValue";
import getToken from "../../lib/getToken";

class ClaimModal extends React.Component {
  state = {
    loading: false,
    hasClaimToken: false,
    claimDetails: null,
  };

  componentDidMount() {
    this.handleFetchClaimDetails();
  }

  getOptionDetails = async () => {
    const state = store.getState();

    let optionId = null;

    const contractAddress =
      state?.wallet?.connection?.optionsSettlementEngineAddress;

    if (this.props.claim.token.claim.option) {
      const tokenId = `0x${this.props.claim.token.claim.option}`;

      optionId = `${contractAddress.toLowerCase()}/${tokenId}`;
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

    return sanitizedData.erc1155Balances[0];
  };

  handleFetchClaimDetails = async () => {
    this.setState({ loading: true }, async () => {
      const option = await this.getOptionDetails();

      const expiryDate = moment(option.token.option.expiryTimestamp, "X");

      const claimID = this.props.claim.token.claim.id;

      const state = store.getState();

      const connection = state?.wallet?.connection;
      const { contract, accounts } = connection;
      const userAccount = accounts[0].toLowerCase();

      const balance = await contract.balanceOf(userAccount, claimID);

      const underlying = await contract.underlying(claimID);

      const exerciseAsset = getToken({
        id: underlying.exerciseAsset.toLowerCase(),
      });

      const underlyingAsset = getToken({
        id: underlying.underlyingAsset.toLowerCase(),
      });

      this.setState({
        loading: false,
        hasClaimToken: balance.toNumber() === 1 ? true : false,
        claimDetails: {
          balance,
          exerciseAsset,
          exercisePosition: underlying.exercisePosition,
          underlyingAsset,
          underlyingPosition: underlying.underlyingPosition,
          expiryDate: expiryDate.format(),
        },
      });
    });
  };

  handleRedeemClaim = async () => {
    const claimID = this.props.claim.token.claim.id;

    const state = store.getState();

    const connection = state?.wallet?.connection;
    const { contract, signer } = connection;

    await contract.connect(signer).redeem(claimID);

    this.props.onClose();
  };

  render() {
    const { loading, hasClaimToken, claimDetails } = this.state;
    const { claim } = this.props;

    const formattedUnderlyingAmount = claimDetails
      ? ethers.utils.formatUnits(
          claimDetails.underlyingPosition,
          claimDetails.underlyingAsset.decimals
        )
      : null;

    const formattedExereciseAmount = claimDetails
      ? ethers.utils.formatUnits(
          claimDetails.exercisePosition,
          claimDetails.exerciseAsset.decimals
        )
      : null;

    return (
      <>
        <ModalBackdrop open={this.props.open}>
          <StyledModal className="modal">
            <i className="fas fa-xmark" onClick={this.props.onClose} />
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Balance</h5>
                <h4>{claimDetails?.balance.toString()}</h4>
              </div>
              <div className="option-datapoint">
                <h5>Expiry Date</h5>
                <h4>
                  {claimDetails &&
                    moment(claimDetails.expiryDate).format("MMM Do, YYYY")}
                </h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Underlying Asset Amount</h5>
                <h4>
                  {formattedUnderlyingAmount}{" "}
                  {claimDetails?.underlyingAsset.symbol}{" "}
                  <span>(x {claimDetails?.balance.toString()})</span>
                </h4>
              </div>
              <div className="option-datapoint">
                <h5>Exercise Asset Amount</h5>
                <h4>
                  {formattedExereciseAmount}{" "}
                  {claimDetails?.exerciseAsset.symbol}{" "}
                  <span>(x {claimDetails?.balance.toString()})</span>
                </h4>
              </div>
            </div>
            <div className="button-group">
              <Link href={`/vault/options?option=${claim.token.claim.option}`}>
                <Button theme="cool-gray">View Option</Button>
              </Link>
              <Button
                disabled={loading || !hasClaimToken}
                theme="purple-blue"
                onClick={this.handleRedeemClaim}
              >
                Redeem
              </Button>
            </div>
          </StyledModal>
        </ModalBackdrop>
      </>
    );
  }
}

export default ClaimModal;
