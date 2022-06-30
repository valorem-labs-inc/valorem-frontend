import React, { FormEvent, Fragment, useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import moment from "moment";
import DateTime from "react-datetime";
import { useAccount, useSigner } from "wagmi";

import Amount from "../amount";
import Button from "../button";
import OptionModal from "../optionModal";
import TokenSelect from "../tokenSelect";
import Warning from "../warning";
import {
  smartFormatCurrency,
  smartParseCurrency,
} from "../../lib/currencyFormat";
import { Option } from "../../lib/types";
import optionsSettlementEngineABI from "../../lib/abis/optionsSettlementEngine";
import getConfigValue from "../../lib/getConfigValue";
import erc20ABI from "../../lib/abis/erc20";
import { handleApproveToken } from "../../lib/utilities";
import StyledNewOption from "./styled";

const NewOptionView: NextPage = () => {
  const NOW = moment().unix();

  const optionsSettlementEngineAddress = getConfigValue("contract.address");

  const [balance, setBalance] = useState(BigNumber.from(0));
  const [balanceTooLow, setBalanceTooLow] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [needsNewOptionType, setNeedsNewOptionType] = useState(false);
  const [underlyingAssetName, setUnderlyingAssetName] = useState(""); // NOTE: Just for display, not used in transaction.
  const [writeWarning, setWriteWarning] = useState(null);
  const [writingOption, setWritingOption] = useState(false);
  const [id, setID] = useState("");
  const [canExercise, setCanExercise] = useState(false);
  const [exerciseAmount, setExerciseAmount] = useState(BigNumber.from(0));
  const [exerciseAsset, setExerciseAsset] = useState("");
  const [underlyingAsset, setUnderlyingAsset] = useState("");
  const [underlyingAmount, setUnderlyingAmount] = useState(BigNumber.from(0));
  const [exerciseTimestamp, setExerciseTimestamp] = useState(NOW);
  const [expiryTimestamp, setExpiryTimestamp] = useState(NOW);

  const router = useRouter();

  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const [underlyingBalance, setUnderlyingBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    async function updateUnderlyingBalance() {
      const token = new Contract(underlyingAsset, erc20ABI, signer);
      const balance = await token.balanceOf(account.address);
      setUnderlyingBalance(balance);
    }
    if (underlyingAsset !== "") {
      updateUnderlyingBalance();
    }
  }, [underlyingAsset, signer, account]);

  function makeOptionObject() {
    return {
      id,
      underlyingAsset,
      exerciseTimestamp,
      expiryTimestamp,
      exerciseAsset,
      exerciseAmount,
      settlementSeed: BigNumber.from(0),
      underlyingAmount,
    };
  }

  async function handleWriteContract() {
    const contract = new Contract(
      optionsSettlementEngineAddress,
      optionsSettlementEngineABI,
      signer
    );

    const option = makeOptionObject();

    const totalUnderlyingAmount = underlyingAmount.mul(balance);

    const hasRequiredBalance = underlyingBalance.gte(totalUnderlyingAmount);

    if (!hasRequiredBalance) {
      setBalanceTooLow(true);
      setWritingOption(false);
      setWriteWarning("Balance of underlying asset too low to write.");
      return;
    }

    const underlyingContract = new Contract(underlyingAsset, erc20ABI, signer);

    const allowance = await underlyingContract.allowance(
      account.address,
      optionsSettlementEngineAddress
    );

    const hasAllowance = allowance.gte(totalUnderlyingAmount);

    if (!hasAllowance) {
      setNeedsApproval(true);
      return;
    } else {
      setNeedsApproval(false);
    }

    let optionId = await getOptionTypeId(contract, getOptionTypeHash(option));

    if (!balanceTooLow && hasAllowance) {
      if (parseInt(optionId) === 0) {
        const tx = await contract.newChain(option);
        const receipt = await tx.wait();

        optionId = BigNumber.from(receipt.logs[0].topics[1]).toHexString();
      }

      await handleWrite(optionId, balance);
    }
  }

  async function handleWrite(
    optionId: string,
    numberOfContracts: BigNumber = BigNumber.from(0)
  ) {
    const contract = new Contract(
      optionsSettlementEngineAddress,
      optionsSettlementEngineABI,
      signer
    );

    const tx = await contract.write(optionId, numberOfContracts);

    await tx.wait();

    router.push(`/vault/options?option=${parseInt(optionId)}`);
  }

  function handleWriteOption(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setWriteWarning(null);

    setWritingOption(true);

    handleWriteContract();
  }

  async function handleApproveAndWrite() {
    await handleApproveToken(
      underlyingAsset,
      optionsSettlementEngineAddress,
      signer
    );
    setNeedsApproval(false);
    await handleWriteContract();
  }

  // TODO(Check here for assets being the same, they can't be)
  // TODO(Check here that the dates input are valid)
  // TODO(This should ideally present the user with a few common asset/strike/expiry/exercise to write)
  // Will help liquidity fragmentation, and this present screen will be a "custom" option
  // Out of scope for MVP.
  return (
    <Fragment>
      <StyledNewOption>
        <header>
          <h4>Write Option</h4>
        </header>
        <form onSubmit={handleWriteOption}>
          <fieldset disabled={writingOption}>
            <div className="contract-options">
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="numContracts">Number of Contracts</label>
                  <Amount
                    id="numContracts"
                    label="#"
                    paddingLeft="65px"
                    value={balance.toNumber().toString()}
                    onChange={(event) => {
                      let nextBalance = 0;
                      try {
                        if (event.target.value === "") {
                          nextBalance = 0;
                        } else {
                          nextBalance = parseInt(event.target.value, 10);
                        }
                      } catch {
                        nextBalance = 0;
                      }
                      setBalance(BigNumber.from(nextBalance));
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="exerciseTimestamp">Exercise From Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment.unix(exerciseTimestamp)}
                    onChange={(date) => {
                      setExerciseTimestamp(moment(date).unix());
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="expiryTimestamp">Expiration Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment.unix(expiryTimestamp)}
                    onChange={(date) => {
                      setExpiryTimestamp(moment(date).unix());
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
                      setExerciseAsset(asset);
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
                    setExerciseAmount(
                      smartParseCurrency(
                        event?.target?.value || "0",
                        exerciseAsset
                      )
                    );
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
                      setUnderlyingAsset(asset);
                      setUnderlyingAssetName(assetName);
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
                  value={smartFormatCurrency(underlyingAmount, underlyingAsset)}
                  onChange={(event) => {
                    setUnderlyingAmount(
                      smartParseCurrency(
                        event?.target?.value || "0",
                        underlyingAsset
                      )
                    );
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
          </fieldset>
        </form>
      </StyledNewOption>
      <OptionModal
        hide={false}
        open={!!needsApproval}
        balance={balance}
        canExercise={canExercise}
        needsApproval={needsApproval}
        option={makeOptionObject()}
        onApprove={handleApproveAndWrite}
        onClose={() => {
          console.log("close option modal");
        }}
      />
    </Fragment>
  );
};

export default NewOptionView;

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
  const encoded = ethers.utils.defaultAbiCoder.encode(
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
