export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "accessor",
        type: "address",
      },
      {
        internalType: "address",
        name: "permissioned",
        type: "address",
      },
    ],
    name: "AccessControlViolation",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimTooSoon",
    type: "error",
  },
  {
    inputs: [],
    name: "ExerciseTooEarly",
    type: "error",
  },
  {
    inputs: [],
    name: "ExerciseWindowTooShort",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        internalType: "uint40",
        name: "expiry",
        type: "uint40",
      },
    ],
    name: "ExpiredOption",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpiryTooSoon",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset1",
        type: "address",
      },
      {
        internalType: "address",
        name: "asset2",
        type: "address",
      },
    ],
    name: "InvalidAssets",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "token",
        type: "uint256",
      },
    ],
    name: "InvalidClaim",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "token",
        type: "uint256",
      },
    ],
    name: "InvalidOption",
    type: "error",
  },
  {
    inputs: [],
    name: "NoClaims",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "OptionsChainExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "token",
        type: "uint256",
      },
    ],
    name: "TokenNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "redeemer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "exerciseAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "exerciseAmount",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "underlyingAmount",
        type: "uint96",
      },
    ],
    name: "ClaimRedeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "amountAssigned",
        type: "uint112",
      },
    ],
    name: "ExerciseAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "payor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FeeAccrued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FeeSwept",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "exerciseAsset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "exerciseAmount",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "underlyingAmount",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "exerciseTimestamp",
        type: "uint40",
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "expiryTimestamp",
        type: "uint40",
      },
    ],
    name: "NewChain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "exercisee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "amount",
        type: "uint112",
      },
    ],
    name: "OptionsExercised",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "writer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "amount",
        type: "uint112",
      },
    ],
    name: "OptionsWritten",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "option",
            type: "uint256",
          },
          {
            internalType: "uint112",
            name: "amountWritten",
            type: "uint112",
          },
          {
            internalType: "uint112",
            name: "amountExercised",
            type: "uint112",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct IOptionSettlementEngine.Claim",
        name: "claimInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        internalType: "uint112",
        name: "amount",
        type: "uint112",
      },
    ],
    name: "exercise",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "feeBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeBps",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "hashToOptionToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint40",
            name: "exerciseTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "expiryTimestamp",
            type: "uint40",
          },
          {
            internalType: "address",
            name: "exerciseAsset",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "underlyingAmount",
            type: "uint96",
          },
          {
            internalType: "uint160",
            name: "settlementSeed",
            type: "uint160",
          },
          {
            internalType: "uint96",
            name: "exerciseAmount",
            type: "uint96",
          },
        ],
        internalType: "struct IOptionSettlementEngine.Option",
        name: "optionInfo",
        type: "tuple",
      },
    ],
    name: "newChain",
    outputs: [
      {
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "option",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint40",
            name: "exerciseTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "expiryTimestamp",
            type: "uint40",
          },
          {
            internalType: "address",
            name: "exerciseAsset",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "underlyingAmount",
            type: "uint96",
          },
          {
            internalType: "uint160",
            name: "settlementSeed",
            type: "uint160",
          },
          {
            internalType: "uint96",
            name: "exerciseAmount",
            type: "uint96",
          },
        ],
        internalType: "struct IOptionSettlementEngine.Option",
        name: "optionInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newFeeTo",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "sweepFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenType",
    outputs: [
      {
        internalType: "enum IOptionSettlementEngine.Type",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "underlying",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "int256",
            name: "underlyingPosition",
            type: "int256",
          },
          {
            internalType: "address",
            name: "exerciseAsset",
            type: "address",
          },
          {
            internalType: "int256",
            name: "exercisePosition",
            type: "int256",
          },
        ],
        internalType: "struct IOptionSettlementEngine.Underlying",
        name: "underlyingPositions",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
      {
        internalType: "uint112",
        name: "amount",
        type: "uint112",
      },
    ],
    name: "write",
    outputs: [
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
