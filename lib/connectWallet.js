import Web3Modal from "web3modal";
import walletProviderOptions from "./walletProviderOptions";
import getWalletConnection from "./getWalletConnection";

// TODO(This wallet connection should be cached and persist between sessions)
export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3Modal = new Web3Modal({
        network: process.env.NODE_ENV === "development" ? "rinkeby" : "mainnet",
        providerOptions: walletProviderOptions,
        cacheProvider: true,
      });

      console.log("got modal");

      // console.log(web3Modal.cachedProvider);

      // web3Modal.clearCachedProvider();

      const provider = await web3Modal.connect();

      console.log(provider);
      console.log("got provider");

      const connection = await getWalletConnection(provider);

      console.log("got connection");

      resolve({
        web3Modal,
        provider,
        connection,
      });
    } catch (exception) {
      reject(exception);
    }
  });
};
