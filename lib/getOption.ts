import { BigNumber } from "ethers";

import graphql from "../graphql/client";
import { optionQuery } from "../graphql/queries/options";
import type {
  GraphOption,
  GraphOptionResponse,
  GraphTokenResponse,
  Option,
} from "./types";
import unfreezeApolloCacheValue from "./unfreezeApolloCacheValue";

const graphTokenToOption = (graphToken: GraphTokenResponse): Option => {
  const graphOption: GraphOption = graphToken.token.option;
  return {
    id: graphToken.token.identifier,
    exerciseAmount: BigNumber.from(graphOption.exerciseAmount),
    exerciseAsset: graphOption.exerciseAsset.id,
    exerciseTimestamp: parseInt(graphOption.exerciseTimestamp ?? "0", 10),
    expiryTimestamp: parseInt(graphOption.expiryTimestamp ?? "0", 10),
    underlyingAmount: BigNumber.from(graphOption.underlyingAmount),
    underlyingAsset: graphOption.underlyingAsset.id,
  };
};

export default async function getOption(
  optionHash: string,
  account: string,
  contractAddress: string
): Promise<Option | null> {
  if (optionHash && account) {
    const tokenId = BigNumber.from(optionHash).toHexString();
    const query = {
      query: optionQuery,
      variables: {
        account: account.toLowerCase(),
        token: `${contractAddress}/${tokenId}`,
      },
    };

    const { data } = await graphql.query(query);
    if (data) {
      const typedData = data as GraphOptionResponse;
      if (typedData.erc1155Balances.length > 0) {
        const rawOption = unfreezeApolloCacheValue(
          typedData.erc1155Balances[0]
        );
        return graphTokenToOption(rawOption as GraphTokenResponse);
      }
    }
  }
  return null;
}

/*
Use the following to test:
{ "account": "0x2546823acdc85c65f6e1281a46c6c1aaf3209584", "token": "0xb79ddbec890fde9a993e3c8c57e27629e2217aaa/0x2b"}

example query from the graph
https://api.studio.thegraph.com/query/13157/valorem/0.0.3/graphql?query=query+OptionDetails%28%24account%3A+String%2C+%24token%3A+String%29+%7B%0A++++erc1155Balances%28where%3A+%7B+account%3A+%24account%2C+token%3A+%24token+%7D%29+%7B%0A++++++valueExact%0A++++++token+%7B%0A++++++++identifier%0A++++++++option+%7B%0A++++++++++exerciseAsset+%7B%0A++++++++++++id%0A++++++++++%7D%0A++++++++++exerciseTimestamp%0A++++++++++expiryTimestamp%0A++++++++++underlyingAmount%0A++++++++++underlyingAsset+%7B%0A++++++++++++id%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D%0A++++%7D%0A++%7D

{
  "data": {
    "erc1155Balances": [
      {
        "valueExact": "1",
        "token": {
          "identifier": "43",
          "option": {
            "exerciseAsset": {
              "id": "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"
            },
            "exerciseTimestamp": "1652850000",
            "expiryTimestamp": "1653627600",
            "underlyingAmount": "500000000000000",
            "underlyingAsset": {
              "id": "0xdf032bc4b9dc2782bb09352007d4c57b75160b15"
            }
          }
        }
      }
    ]
  }
}
*/
