import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import getToken from "./getToken";

export function smartFormatCurrency(value: BigNumber, address: string) {
  const decimals = getToken(address)?.decimals ?? 18;
  return formatUnits(value, decimals);
}

export function smartParseCurrency(value: string, address: string) {
  const decimals = getToken(address)?.decimals ?? 18;
  return parseUnits(value, decimals);
}
