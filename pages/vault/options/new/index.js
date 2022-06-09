import React from "react";
import DateTime from "react-datetime";
import moment from "moment";
import { ethers } from "ethers";
import Web3 from "web3";
import Vault from "../../../../layouts/vault";
import Amount from "../../../../components/amount";
import Button from "../../../../components/button";
import Warning from "../../../../components/warning";
import TokenSelect from "../../../../components/tokenSelect";
import OptionModal from "../../../../components/optionModal";
import {
  checkIfHasRequiredBalance,
  checkIfHasAllowance,
  handleApproveToken,
} from "../../../../lib/utilities";
import store from "../../../../lib/store";

import StyledNewOption from "./index.css.js";
import Router from "next/router";

const web3 = new Web3();
const MAX_APPROVAL =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

class NewOption extends React.Component {
  state = {
    balance: 0,
    exerciseTimestamp: "",
    expiryTimestamp: "",
    exerciseAsset: "",
    exerciseAmount: 0,
    underlyingAsset: "",
    underlyingAssetName: "", // NOTE: Just for display, not used in transaction.
    underlyingAmount: 0,
    optionType: null,
    writeWarning: null,
    writingOption: false,
    balanceTooLow: false,
    needsApproval: false,
    needsNewOptionType: false,
  };

  handleWrite = (contract = {}, optionId = "", numberOfContracts = 0) => {
    // TODO(This should push to the option detail once it exists)
    contract.write(optionId, numberOfContracts).then((response) => {
      contract.on("OptionsWritten", (optionId, writer, claimId, amount) => {
        Router.push(`/vault/options?option=${optionId}`);
      });
    });
  };

  handleWriteContract = async () => {
    const hasRequiredBalance = await checkIfHasRequiredBalance(
      this.optionType.underlyingAsset,
      this.optionType.underlyingAmount,
      this.state.balance
    );
    const hasAllowance = await checkIfHasAllowance(this.state?.underlyingAsset);
    let optionId = await this.handleGetOptionTypeId(
      this.contractWithSigner,
      this.handleGetOptionTypeHash(this.optionType)
    );

    if (!hasRequiredBalance) {
      this.setState({
        balanceTooLow: true,
        writingOption: false,
        writeWarning: `Balance of underlying asset too low to write.`,
      });
    } else {
      this.setState({ balanceTooLow: false, writeWarning: null });
    }

    if (!hasAllowance) {
      this.setState({ needsApproval: true });
    } else {
      this.setState({ needsApproval: false });
    }

    if (!this.state.balanceTooLow && !this.state.needsApproval) {
      if (optionId._hex === "0x00") {
        this.contractWithSigner
          .newChain(this.optionType)
          .then(async (response) => {
            this.contractWithSigner.on("NewChain", async (newOptionId) => {
              optionId = newOptionId;
              this.handleWrite(
                this.contractWithSigner,
                optionId,
                ethers.BigNumber.from(this.state.balance)
              );
            });
          });
      } else {
        this.handleWrite(
          this.contractWithSigner,
          optionId,
          ethers.BigNumber.from(this.state.balance)
        );
      }
    }
  };

  handleGetOptionTypeId = async (contractWithSigner = {}, chainHash = "") => {
    try {
      return contractWithSigner.hashToOptionToken(chainHash);
    } catch (exception) {
      console.warn(exception);
    }
  };

  handleGetOptionTypeHash = (option = {}) => {
    let encoded = web3.eth.abi.encodeParameters(
      ["address", "uint40", "uint40", "address", "uint96", "uint160", "uint96"],
      Object.values(option)
    );
    return ethers.utils.keccak256(encoded);
  };

  handleGetOptionType = () => {
    return {
      underlyingAsset: this.state.underlyingAsset,
      exerciseTimestamp: ethers.BigNumber.from(
        moment(this.state.exerciseTimestamp).unix()
      ),
      expiryTimestamp: ethers.BigNumber.from(
        moment(this.state.expiryTimestamp).unix()
      ),
      exerciseAsset: this.state.exerciseAsset,
      exerciseAmount: ethers.utils.parseEther(this?.state?.exerciseAmount),
      settlementSeed: ethers.BigNumber.from(0),
      underlyingAmount: ethers.utils.parseEther(this?.state?.underlyingAmount),
    };
  };

  handleGetConnection = () => {
    const state = store.getState();
    const connection = state?.wallet?.connection;
    return connection;
  };

  handleWriteOption = async (event) => {
    event.preventDefault();

    this.setState(
      { writingOption: true, lowBalanceWarning: null },
      async () => {
        this.connection = this.handleGetConnection();

        const contract = this.connection?.contract;
        const signer = this.connection?.signer;

        this.contractWithSigner = contract ? contract.connect(signer) : null;
        this.optionType = this.handleGetOptionType();

        this.setState({ writingOption: true }, async () => {
          await this.handleWriteContract();
        });
      }
    );
  };

  render() {
    const {
      balance,
      exerciseTimestamp,
      expiryTimestamp,
      exerciseAsset,
      exerciseAmount,
      underlyingAsset,
      underlyingAmount,
      writeWarning,
      needsApproval,
      writingOption,
    } = this.state;

    // TODO(Check here for assets being the same, they can't be)
    // TODO(Check here that the dates input are valid)
    // TODO(This should ideally present the user with a few common asset/strike/expiry/exercise to write)
    // Will help liquidity fragmentation, and this present screen will be a "custom" option
    // Out of scope for MVP.
    return (
      <Vault>
        <StyledNewOption>
          <header>
            <h4>Write Option</h4>
          </header>
          <form disabled={writingOption} onSubmit={this.handleWriteOption}>
            <div className="contract-options">
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="balance">Number of Contracts</label>
                  <Amount
                    label="#"
                    paddingLeft="65px"
                    value={balance}
                    onChange={(event) => {
                      this.setState({ balance: event.target.value });
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="exerciseTimestamp">Exercise From Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment(exerciseTimestamp)}
                    onChange={(date) => {
                      // NOTE: date is a moment() object, here format it as an ISO-8601 string.
                      this.setState({ exerciseTimestamp: date.format() });
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="expiryTimestamp">Expiration Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment(expiryTimestamp)}
                    onChange={(date) => {
                      // NOTE: date is a moment() object, here format it as an ISO-8601 string.
                      this.setState({ expiryTimestamp: date.format() });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="asset">
              <header>
                <h4>Exercise Asset</h4>
              </header>
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="exerciseAsset">Asset</label>
                  <TokenSelect
                    value={exerciseAsset}
                    onChange={(asset) => {
                      this.setState({ exerciseAsset: asset });
                    }}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <label htmlFor="exerciseAmount">Amount</label>
                <Amount
                  label="Ether"
                  paddingLeft="108px"
                  value={exerciseAmount}
                  onChange={(event) => {
                    this.setState({ exerciseAmount: event?.target?.value });
                  }}
                />
              </div>
            </div>
            <div className="asset">
              <header>
                <h4>Underlying Asset</h4>
              </header>
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="underlyingAsset">Asset</label>
                  <TokenSelect
                    value={underlyingAsset}
                    onChange={(asset, assetName) => {
                      this.setState({
                        underlyingAsset: asset,
                        underlyingAssetName: assetName,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <label htmlFor="underlyingAmount">Amount</label>
                <Amount
                  label="Ether"
                  paddingLeft="108px"
                  value={underlyingAmount}
                  onChange={(event) => {
                    this.setState({ underlyingAmount: event?.target?.value });
                  }}
                />
              </div>
            </div>
            <Warning center>
              <p>
                <strong>👉</strong> Valorem charges a 0.05% fee in order to
                exercise this option.
              </p>
            </Warning>
            {writeWarning && <p className="write-warning">{writeWarning}</p>}
            <Button disabled={writingOption} type="submit" theme="purple-blue">
              {writingOption ? "Writing option..." : "Write New Option"}
            </Button>
          </form>
        </StyledNewOption>
        <OptionModal
          hide={false}
          open={!!needsApproval}
          needsApproval={needsApproval}
          option={{
            balance,
            exerciseTimestamp,
            expiryTimestamp,
            underlyingAsset,
            underlyingAmount,
            exerciseAmount,
            exerciseAsset,
            needsApproval,
          }}
          onApprove={async () => {
            await handleApproveToken(underlyingAsset, () => {
              this.setState({ needsApproval: false }, this.handleWriteContract);
            });
          }}
        />
      </Vault>
    );
  }
}

NewOption.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default NewOption;
