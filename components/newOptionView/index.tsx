import React, { FC } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { Option } from "../../lib/types";
import NewOptionForm from "../newOptionForm";
import ConnectedRoute from "../connectedRoute";
import { Title, Description } from "./elements";

const NewOptionView: FC = () => {
  return (
    <ConnectedRoute>
      <Title>Write new option</Title>
      <Description>
        Valorem will charge a 0.05% fee in order to exercise this option.
      </Description>
      <NewOptionForm />
    </ConnectedRoute>
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
