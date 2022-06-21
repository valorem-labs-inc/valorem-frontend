// from https://github.com/0xProject/tools/blob/development/ethereum-types/src/index.ts

import { BigNumber, ethers } from "ethers";

// we don't need all their types - we just need the ones we use
export type ContractAbi = AbiDefinition[];

export type AbiDefinition = FunctionAbi | EventAbi | RevertErrorAbi;

export type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;

export type ConstructorStateMutability = "nonpayable" | "payable";
export type StateMutability = "pure" | "view" | ConstructorStateMutability;

export interface MethodAbi {
  // Ideally this would be set to: `'function'` but then TS complains when artifacts are loaded
  // from JSON files, and this value has type `string` not type `'function'`
  type: string;
  name: string;
  inputs: DataItem[];
  outputs: DataItem[];
  constant?: boolean;
  stateMutability: StateMutability;
  payable?: boolean;
}

export interface ConstructorAbi {
  // Ideally this would be set to: `'constructor'` but then TS complains when artifacts are loaded
  // from JSON files, and this value has type `string` not type `'constructor'`
  type: string;
  inputs: DataItem[];
  payable?: boolean;
  stateMutability: ConstructorStateMutability;
}

export interface FallbackAbi {
  // Ideally this would be set to: `'fallback'` but then TS complains when artifacts are loaded
  // from JSON files, and this value has type `string` not type `'fallback'`
  type: string;
  payable: boolean;
}

export interface EventParameter extends DataItem {
  indexed: boolean;
}

export interface RevertErrorAbi {
  type: "error";
  name: string;
  arguments?: DataItem[];
}

export interface EventAbi {
  // Ideally this would be set to: `'event'` but then TS complains when artifacts are loaded
  // from JSON files, and this value has type `string` not type `'event'`
  type: string;
  name: string;
  inputs: EventParameter[];
  anonymous: boolean;
}

export interface DataItem {
  name: string;
  type: string;
  internalType?: string;
  components?: DataItem[];
}

export type Token = {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
};

export interface Wallet {
  accounts: string[];
  connection: ethers.utils.ConnectionInfo;
  contract: ethers.Contract;
  erc20: (address: string) => ethers.Contract;
  ethers: ethers.providers.Web3Provider;
  gasPrice: BigNumber;
  network: ethers.providers.Network;
  optionsSettlementEngineAddress: string;
  signer: ethers.providers.JsonRpcSigner;
}

export interface Claim {
  id: String;
  option?: Partial<Option>;
  amountWritten: number;
  amountExercised: number;
  claimed: boolean;
}

export interface Option {
  id: string;
  exerciseAmount: BigNumber;
  exerciseAsset: string;
  exerciseTimestamp: number;
  expiryTimestamp: number;
  underlyingAmount: BigNumber;
  underlyingAsset: string;
  settlementSeed?: BigNumber;
}

export type OptionDetails = {
  option: Option;
  balance: BigNumber;
  canExercise: boolean;
  needsApproval: boolean;
};

// Graph response types
// types for getOptions

export type GraphBalanceOption = {
  creator: { id: string };
  exerciseAmount: string;
  exerciseAsset: { id: string };
  exerciseTimestamp: string;
  expiryTimestamp: string;
  id: number;
  underlyingAmount: string;
  underlyingAsset: { id: string };
};

export type GraphTokenBalance = {
  type: number;
  option: GraphBalanceOption;
  id: string;
};

export type GraphTokenBalanceResponse = {
  token: GraphTokenBalance;
  valueExact: number;
};

export type GraphBalancesResponse = {
  account: {
    ERC1155balances: GraphTokenBalanceResponse[];
  };
};

// types for getOption

export type GraphOption = {
  exerciseAsset: { id: string };
  exerciseAmount: string;
  exerciseTimestamp: string;
  expiryTimestamp: string;
  underlyingAmount: string;
  underlyingAsset: { id: string };
};

export type GraphToken = {
  identifier: string;
  option: GraphOption;
};

export type GraphTokenResponse = {
  token: GraphToken;
  valueExact: string;
};

export type GraphOptionResponse = {
  erc1155Balances: GraphTokenResponse[];
};

// Types for Graph "getClaims" query

export type GraphClaim = {
  id: string;
  amountExercised: null | string;
  amountWritten: string;
  claimed: boolean;
  option: string;
};

export type GraphClaimToken = {
  type: number;
  id: string;
  claim: null | GraphClaim;
  option: {
    id: string;
    expiryTimestamp: "string";
  };
};

export type GraphClaimResponse = {
  id: string;
  token: GraphClaimToken;
  valueExact: number;
};

export type GraphGetClaimsResponse = {
  account: {
    ERC1155balances: GraphClaimResponse[];
  };
};
