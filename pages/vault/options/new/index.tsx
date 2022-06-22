import { BigNumber, Contract, ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import moment from "moment";
import Router from "next/router";
import React from "react";
import DateTime from "react-datetime";
import Web3 from "web3";

import Amount from "../../../../components/amount";
import Button from "../../../../components/button";
import OptionModal from "../../../../components/optionModal";
import TokenSelect from "../../../../components/tokenSelect";
import Warning from "../../../../components/warning";
import Vault from "../../../../layouts/vault";
import {
  smartFormatCurrency,
  smartParseCurrency,
} from "../../../../lib/currencyFormat";
import store, { SiteStore } from "../../../../lib/store";
import { Option, OptionDetails } from "../../../../lib/types";
import {
  checkIfHasAllowance,
  checkIfHasRequiredBalance,
  handleApproveToken,
} from "../../../../lib/utilities";
import StyledNewOption from "./index.css";

const web3 = new Web3();
const MAX_APPROVAL =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

type NewOptionState = Omit<OptionDetails, "option"> &
  Option & {
    balanceTooLow: boolean;
    needsApproval: boolean;
    needsNewOptionType: boolean;
    underlyingAssetName: string;
    writeWarning: string | null;
    writingOption: boolean;
  };

type NewOptionProps = {
  children: React.ReactNode;
};

const ZERO = BigNumber.from(0);

const NOW = moment().unix();

class NewOption extends React.Component<NewOptionProps, NewOptionState> {
  state: NewOptionState = {
    balance: ZERO,
    balanceTooLow: false,
    needsApproval: false,
    needsNewOptionType: false,
    underlyingAssetName: "", // NOTE: Just for display, not used in transaction.
    writeWarning: null,
    writingOption: false,
    id: "",
    canExercise: false,
    exerciseAmount: ZERO,
    exerciseAsset: "",
    exerciseTimestamp: NOW,
    expiryTimestamp: NOW,
    underlyingAsset: "",
    underlyingAmount: ZERO,
  };

  handleWrite = (
    contract: Contract,
    optionId = "",
    numberOfContracts: BigNumber = ZERO
  ) => {
    // TODO(This should push to the option detail once it exists)
    contract.write(optionId, numberOfContracts).then((response) => {
      contract.on("OptionsWritten", (optionId, writer, claimId, amount) => {
        this.setState({ id: optionId });
        Router.push(`/vault/options?option=${optionId}`);
      });
    });
  };

  handleWriteContract = async (contract: Contract, option: Option) => {
    const hasRequiredBalance = await checkIfHasRequiredBalance(
      option.underlyingAsset,
      option.underlyingAmount,
      this.state.balance
    );
    const hasAllowance = await checkIfHasAllowance(
      option.underlyingAsset,
      option.underlyingAmount
    );
    let optionId = await getOptionTypeId(contract, getOptionTypeHash(option));

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
      const total = BigNumber.from(this.state.balance);

      if (parseInt(optionId) === 0) {
        contract.newChain(option).then(async (response) => {
          contract.on("NewChain", async (newOptionId) => {
            optionId = newOptionId;
            this.handleWrite(contract, optionId, this.state.balance);
          });
        });
      } else {
        this.handleWrite(contract, optionId, this.state.balance);
      }
    }
  };

  makeOptionObject = (): Option => {
    const { state } = this;
    return {
      id: state.id,
      underlyingAsset: state.underlyingAsset,
      exerciseTimestamp: state.exerciseTimestamp,
      expiryTimestamp: state.expiryTimestamp,
      exerciseAsset: state.exerciseAsset,
      exerciseAmount: state.exerciseAmount,
      settlementSeed: ZERO,
      underlyingAmount: state.underlyingAmount,
    };
  };

  doWriteOption = async (): Promise<void> => {
    this.setState({ writingOption: true }, async () => {
      console.log("writing option");
      const { wallet }: SiteStore = store.getState();
      if (!wallet) {
        console.warn("No wallet found");
        this.setState({ writingOption: false });
        return;
      }
      const { contract, signer } = wallet;
      if (!contract) {
        console.warn("No contract found");
        this.setState({ writingOption: false });
        return;
      }
      const contractWithSigner: Contract = contract.connect(signer);
      const option: Option = this.makeOptionObject();

      this.setState({ writingOption: true }, async () => {
        await this.handleWriteContract(contractWithSigner, option);
      });
    });
  };

  handleWriteOption = async (event) => {
    event.preventDefault();
    await this.doWriteOption();
  };

  handleApproveAndWrite = async (): Promise<void> => {
    const { underlyingAsset, underlyingAmount } = this.state;
    if (!underlyingAsset || !underlyingAmount.gt(0)) {
      console.warn("No underlying asset or amount specified");
    } else {
      if (this.state.needsApproval) {
        await handleApproveToken(underlyingAsset);
        this.setState({ needsApproval: false }, () => {
          this.doWriteOption();
        });
      } else {
        await this.doWriteOption();
      }
    }
  };

  render() {
    const {
      balance,
      canExercise,
      writeWarning,
      needsApproval,
      writingOption,
      exerciseTimestamp,
      expiryTimestamp,
      exerciseAsset,
      exerciseAmount,
      id,
      underlyingAsset,
      underlyingAmount,
    } = this.state;

    console.log("statge", this.state);

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
          <form onSubmit={this.handleWriteOption}>
            <fieldset disabled={writingOption}>
              <div className="contract-options">
                <div className="form-row">
                  <div className="form-input-group">
                    <label htmlFor="balance">Number of Contracts</label>
                    <Amount
                      id="numContracts"
                      label="#"
                      paddingLeft="65px"
                      value={balance.toNumber().toString()}
                      onChange={(event) => {
                        let balance = 0;
                        try {
                          balance = parseInt(event.target.value, 10);
                        } catch {
                          balance = 0;
                        }
                        this.setState({ balance: BigNumber.from(balance) });
                      }}
                    />
                  </div>
                  <div className="form-input-group">
                    <label htmlFor="exerciseTimestamp">
                      Exercise From Date
                    </label>
                    <DateTime
                      timeFormat={false}
                      value={moment.unix(exerciseTimestamp)}
                      onChange={(date) => {
                        this.setState({
                          exerciseTimestamp: moment(date).unix(),
                        });
                      }}
                    />
                  </div>
                  <div className="form-input-group">
                    <label htmlFor="expiryTimestamp">Expiration Date</label>
                    <DateTime
                      timeFormat={false}
                      value={moment.unix(expiryTimestamp)}
                      onChange={(date) => {
                        this.setState({ expiryTimestamp: moment(date).unix() });
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
                    id="etherAmount"
                    label="Ether"
                    paddingLeft="108px"
                    value={smartFormatCurrency(exerciseAmount, exerciseAsset)}
                    onChange={(event) => {
                      this.setState({
                        exerciseAmount: smartParseCurrency(
                          event?.target?.value || "0",
                          exerciseAsset
                        ),
                      });
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
                    id="underlyingEther"
                    label="Ether"
                    paddingLeft="108px"
                    value={smartFormatCurrency(
                      underlyingAmount,
                      underlyingAsset
                    )}
                    onChange={(event) => {
                      this.setState({
                        underlyingAmount: smartParseCurrency(
                          event?.target?.value || "0",
                          underlyingAsset
                        ),
                      });
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
              <Button
                disabled={writingOption}
                type="submit"
                theme="purple-blue"
              >
                {writingOption ? "Writing option..." : "Write New Option"}
              </Button>
            </fieldset>
          </form>
        </StyledNewOption>
        <OptionModal
          hide={false}
          open={!!needsApproval}
          balance={balance}
          canExercise={canExercise}
          needsApproval={needsApproval}
          option={this.makeOptionObject()}
          onApprove={this.handleApproveAndWrite}
          onClose={() => {
            console.log("close option modal");
          }}
        />
      </Vault>
    );
  }
}

async function getOptionTypeId(
  contract: Contract,
  chainHash = ""
): Promise<string> {
  try {
    return contract.hashToOptionToken(chainHash);
  } catch (exception) {
    console.warn(exception);
  }
  return "";
}

function getOptionTypeHash(option: Option) {
  const encoded = web3.eth.abi.encodeParameters(
    ["address", "uint40", "uint40", "address", "uint96", "uint160", "uint96"],
    [
      option.underlyingAsset,
      option.exerciseTimestamp,
      option.expiryTimestamp,
      option.exerciseAsset,
      option.underlyingAmount,
      BigNumber.from(0),
      option.exerciseAmount,
    ]
  );
  return ethers.utils.keccak256(encoded);
}

export default NewOption;
