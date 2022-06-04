import ethProvider from "eth-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

// NOTE: Temporarily disabling additional providers due to common usage of the
// window.ethereum global when connecting wallets (wallets pop up simultaneously
// regardless of the clicked provider).

export default {
  // frame: {
  //   package: ethProvider
  // },
  // walletlink: {
  //   package: CoinbaseWalletSDK,
  //   options: {
  //     appName: 'Valorem Options',
  //     infuraId: process.env.infura.projectId,
  //   }
  // },
  // walletconnect: {
  //   package: WalletConnectProvider,
  //   options: {
  //     infuraId: process.env.infura.projectId,
  //   }
  // }
};
