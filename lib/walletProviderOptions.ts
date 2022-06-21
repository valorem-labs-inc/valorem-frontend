import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import ethProvider from "eth-provider";
import { IProviderOptions } from "web3modal";

import getConfigValue from "./getConfigValue";

// NOTE: Temporarily disabling additional providers due to common usage of the
// window.ethereum global when connecting wallets (wallets pop up simultaneously
// regardless of the clicked provider).

const infuraId = getConfigValue("infura.projectId");

export default {
  frame: {
    package: ethProvider,
  },
  walletlink: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Valorem Options",
      infuraId,
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId,
    },
  },
} as IProviderOptions;
