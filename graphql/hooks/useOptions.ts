import { useQuery } from "@apollo/client";
import { BigNumber, Contract } from "ethers";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { erc20ABI, useAccount, useProvider } from "wagmi";
import {
  GraphBalanceOption,
  GraphBalancesResponse,
  OptionDetails,
  Option,
} from "../../lib/types";
import unfreezeApolloCacheValue from "../../lib/unfreezeApolloCacheValue";
import { optionsByAccountQuery } from "../queries/options";

function graphOptionToOption(graphOption: GraphBalanceOption): Option {
  return {
    id: graphOption.id.toString(),
    exerciseAmount: BigNumber.from(graphOption.exerciseAmount),
    exerciseAsset: graphOption.exerciseAsset.id,
    exerciseTimestamp: parseInt(graphOption.exerciseTimestamp ?? "0", 10),
    expiryTimestamp: parseInt(graphOption.expiryTimestamp ?? "0", 10),
    underlyingAmount: BigNumber.from(graphOption.underlyingAmount),
    underlyingAsset: graphOption.underlyingAsset.id,
  };
}

export function useOptions() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionDetails[]>([]);

  const { data: account } = useAccount();

  const provider = useProvider();

  const { data: rawGraphResponse, loading: graphqlLoading } =
    useQuery<GraphBalancesResponse>(optionsByAccountQuery, {
      variables: {
        account: account.address.toLowerCase(),
      },
    });

  const processRawGraphResponse = useCallback(async () => {
    const type1Balances = rawGraphResponse.account.ERC1155balances.filter(
      ({ token }) => token.type === 1
    );

    const balanceQueries = type1Balances.map(({ token }) => {
      const tokenContract = new Contract(
        token.option.underlyingAsset.id,
        erc20ABI,
        provider
      );

      return tokenContract.balanceOf(account.address);
    });

    const balances = await Promise.all(balanceQueries);

    const now = moment();

    const _options = type1Balances
      .map(({ token, valueExact }, index) => {
        const tokenBalance = balances[index];
        const graphOption = unfreezeApolloCacheValue(token.option);
        const option = graphOptionToOption(graphOption as GraphBalanceOption);
        const lastDate = moment.unix(option.expiryTimestamp);
        const firstDate = moment.unix(option.exerciseTimestamp);
        const canExercise =
          tokenBalance.gte(option.exerciseAmount) &&
          now.isBetween(firstDate, lastDate);
        return {
          balance: BigNumber.from(valueExact),
          option,
          canExercise,
          needsApproval: true,
        } as OptionDetails;
      })
      .sort((a, b) => {
        return a.option.expiryTimestamp - b.option.expiryTimestamp;
      });

    setOptions(_options);
    setIsLoading(false);
  }, [rawGraphResponse, provider, account]);

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

  return { options, isLoading };
}