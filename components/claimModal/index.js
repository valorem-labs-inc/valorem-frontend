import React from "react";
import { BigNumber } from "ethers";
import Link from "next/link";
import Button from "../button";
import StyledModal, { ModalBackdrop } from "../modal";
import graphql from "../../graphql/client";
import { optionDetails as optionDetailsQuery } from "../../graphql/queries/options";
import store from "../../lib/store";
import unfreezeApolloCacheValue from "../../lib/unfreezeApolloCacheValue";

class ClaimModal extends React.Component {
  state = {
    loading: false,
    hasClaimToken: false,
  };

  componentDidMount() {
    this.handleFetchClaimDetails();
  }

  getOptionDetails = async () => {
    // const state = store.getState();
    // const contractAddress =
    //   state?.wallet?.connection?.optionsSettlementEngineAddress.toLowerCase();
    // const tokenID = BigNumber.from(
    //   this.props.claim.token.claim.option
    // ).toHexString();
    // const account = state?.wallet?.connection?.accounts[0].toLowerCase();
    // const optionId = `${contractAddress}/${tokenID}`;
    // const query = {
    //   query: optionDetailsQuery,
    //   skip: !state?.wallet?.connection?.accounts[0] || !optionId,
    //   variables: {
    //     account: state?.wallet?.connection?.accounts[0].toLowerCase(),
    //     token: optionId,
    //   },
    // };
    // const { data } = await graphql.query(query);
    // const sanitizedData = unfreezeApolloCacheValue(data || []);
    // return sanitizedData.erc1155Balances[0];
  };

  handleFetchClaimDetails = async () => {
    this.setState({ loading: true }, async () => {
      const claimID = this.props.claim.token.claim.id;

      const state = store.getState();

      const connection = state?.wallet?.connection;
      const { contract, accounts } = connection;
      const userAccount = accounts[0].toLowerCase();

      const balance = await contract.balanceOf(userAccount, claimID);

      this.setState({
        loading: false,
        hasClaimToken: balance.toNumber() === 1 ? true : false,
      });
    });

    // const claim = this.props.claim;
    // console.log(claim);
    // const optionData = await this.getOptionDetails();
    // console.log(claim);
    // console.log(optionData);
    // const state = store.getState();
    // const { claimID } = this.props;
    // console.log("----");
    // console.log(claimID);
    // console.log("----");
    // const { data } = await graphql.query({
    //   query: optionDetailsQuery,
    //   // skip: !state?.wallet?.connection?.accounts[0],
    //   variables: {
    //     account: state?.wallet?.connection?.accounts[0].toLowerCase(),
    //     token: claimID,
    //   },
    // });
    // console.log(data);
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
    const { loading, hasClaimToken } = this.state;
    const { claim } = this.props;
    return (
      <>
        <ModalBackdrop open={this.props.open}>
          <StyledModal className="modal">
            <i className="fas fa-xmark" onClick={this.props.onClose} />
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Balance</h5>
                <h4>1</h4>
              </div>
              <div className="option-datapoint">
                <h5>Expiry Date</h5>
                <h4>Jun 30th, 2022</h4>
              </div>
            </div>
            <div className="option-row">
              <div className="option-datapoint">
                <h5>Underlying Asset Amount</h5>
                <h4>
                  1 WETH <span>(x 1)</span>
                </h4>
              </div>
              <div className="option-datapoint">
                <h5>Exercise Asset Amount</h5>
                <h4>
                  1 DAI <span>(x 1)</span>
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
