import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Claim, GraphClaim, GraphClaimResponse } from "../../lib/types";
import unfreezeApolloCacheValue from "../../lib/unfreezeApolloCacheValue";
import { claimsQuery } from "../queries/claims";

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

export function useClaims() {
  const [isLoading, setIsLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);

  const { address } = useAccount();

  const { data: rawGraphResponse, loading: graphqlLoading } = useQuery(
    claimsQuery,
    {
      variables: {
        account: address.toLowerCase(),
      },
    }
  );

  const processRawGraphResponse = useCallback(async () => {
    const balances: GraphClaimResponse[] =
      rawGraphResponse.account?.ERC1155balances ?? [];

    const _claims: Claim[] = [];

    balances.forEach(({ token }) => {
      if (token.type === 2 && token.claim) {
        const claim = unfreezeApolloCacheValue(token.claim);
        _claims.push(graphClaimToClaim(claim as GraphClaim));
      }
    });

    setClaims(_claims);
    setIsLoading(false);
  }, [rawGraphResponse]);

  useEffect(() => {
    if (rawGraphResponse) {
      processRawGraphResponse();
    }
  }, [rawGraphResponse, processRawGraphResponse]);

  useEffect(() => {
    if (graphqlLoading) {
      setIsLoading(true);
    }
  }, [graphqlLoading]);

  return { claims, isLoading };
}
