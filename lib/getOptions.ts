import { BigNumber, ethers } from "ethers";
import moment from "moment";

import graphql from "../graphql/client";
import { optionsByAccountQuery } from "../graphql/queries/options";
import getERC20Balance from "./getERC20Balance";
import type {
  GraphBalanceOption,
  GraphBalancesResponse,
  GraphTokenBalanceResponse,
  Option,
  OptionDetails,
} from "./types";
import unfreezeApolloCacheValue from "./unfreezeApolloCacheValue";

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

async function getRawOptions(account: string): Promise<GraphBalancesResponse> {
  const q = {
    query: optionsByAccountQuery,
    variables: {
      account: account.toLowerCase(),
    },
  };
  const results = await graphql.query(q);
  if (!results) {
    console.error("no results", q);
    return { account: { ERC1155balances: [] } };
  }
  const { data } = results;
  if (!data) {
    console.log("empty options");
    return { account: { ERC1155balances: [] } };
  }
  console.log(`returning ${data.account.ERC1155balances.length} options`);
  return data as GraphBalancesResponse;
}

export default async function getOptions(account: string): Promise<Option[]> {
  const graphResponse = await getRawOptions(account);

  const balances: GraphTokenBalanceResponse[] =
    graphResponse.account.ERC1155balances;
  const options: Option[] = [];
  balances.forEach(({ token }: GraphTokenBalanceResponse) => {
    if (token.type === 1) {
      const option = unfreezeApolloCacheValue(token.option);
      options.push(graphOptionToOption(option as GraphBalanceOption));
    }
  });
  return options;
}

export async function getOptionsWithDetails(
  account: string,
  provider: ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner
): Promise<OptionDetails[]> {
  const graphResponse = await getRawOptions(account);
  let options: OptionDetails[] = [];
  const tokenBalances: Record<string, BigNumber> = {};
  const now = moment();

  const getAssetBalance = async (tokenId: string): Promise<BigNumber> => {
    if (!tokenBalances[tokenId]) {
      tokenBalances[tokenId] = await getERC20Balance(
        tokenId,
        account,
        provider
      );
    }
    return tokenBalances[tokenId];
  };

  if (graphResponse.account?.ERC1155balances) {
    console.log(
      "response",
      JSON.stringify(graphResponse.account.ERC1155balances, null, 2)
    );
    const type1Balances = graphResponse.account.ERC1155balances.filter(
      ({ token }) => token.type === 1
    );
    console.log("type1Balances", type1Balances);
    const balanceQueries = type1Balances.map(({ token }) =>
      getAssetBalance(token.option.underlyingAsset.id)
    );
    const balances = await Promise.all(balanceQueries);
    options = type1Balances.map(({ token, valueExact }, index) => {
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
    });
    console.log(`returning ${options.length} options`);
    options.sort((a, b) => {
      return a.option.expiryTimestamp - b.option.expiryTimestamp;
    });
  }
  console.log(`returning ${options.length} options`);
  return options;
}
