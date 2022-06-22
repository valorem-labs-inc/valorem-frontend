import { BigNumber, ethers } from "ethers";
import { hexDataLength } from "ethers/lib/utils";
import moment from "moment";

import graphql from "../graphql/client";
import { claimsQuery } from "../graphql/queries/claims";
import type {
  Claim,
  GraphClaim,
  GraphClaimResponse,
  GraphGetClaimsResponse,
} from "./types";
import unfreezeApolloCacheValue from "./unfreezeApolloCacheValue";

function graphClaimToClaim(graphClaim: GraphClaim): Claim {
  const {
    id,
    amountExercised: exercisedRaw,
    amountWritten: writtenRaw,
    claimed,
    option,
  } = graphClaim;
  const amountExercised = parseInt(exercisedRaw ?? "0", 10);
  const amountWritten = parseInt(writtenRaw ?? "0", 10);
  return {
    id,
    option: { id: option },
    amountExercised,
    amountWritten,
    claimed,
  };
}

async function getRawClaims(account: string): Promise<GraphGetClaimsResponse> {
  const q = {
    query: claimsQuery,
    variables: {
      account: account.toLowerCase(),
    },
  };
  const results = await graphql.query(q);
  if (!results) {
    console.error("no results", q);
    return { account: { ERC1155balances: [] } };
  }
  console.log("results", results);
  const { data } = results;
  if (!data) {
    return { account: { ERC1155balances: [] } };
  }
  return data as GraphGetClaimsResponse;
}

export default async function getClaims(account: string): Promise<Claim[]> {
  const graphResponse = await getRawClaims(account);

  const balances: GraphClaimResponse[] =
    graphResponse.account?.ERC1155balances ?? [];
  const claims: Claim[] = [];
  balances.forEach(({ token }) => {
    if (token.type === 2 && token.claim) {
      const claim = unfreezeApolloCacheValue(token.claim);
      claims.push(graphClaimToClaim(claim as GraphClaim));
    }
  });
  return claims;
}

/*
{
  "data": {
    "account": {
      "ERC1155balances": [
        {
          "id": "0xb79ddbec890fde9a993e3c8c57e27629e2217aaa/0x1/0x2546823acdc85c65f6e1281a46c6c1aaf3209584",
          "token": {
            "type": 1,
            "option": {
              "id": "1",
              "expiryTimestamp": "1652456558"
            },
            "id": "0xb79ddbec890fde9a993e3c8c57e27629e2217aaa/0x1",
            "claim": null
          },
          "valueExact": "950"
        },
        {
          "id": "0xb79ddbec890fde9a993e3c8c57e27629e2217aaa/0x2/0x2546823acdc85c65f6e1281a46c6c1aaf3209584",
          "token": {
            "type": 2,
            "option": null,
            "id": "0xb79ddbec890fde9a993e3c8c57e27629e2217aaa/0x2",
            "claim": {
              "id": "2",
              "amountExercised": null,
              "amountWritten": "1000",
              "claimed": false,
              "option": "1"
            }
          },
          "valueExact": "1"
        },
      ]
    }
  }
}
*/
