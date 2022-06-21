import { createStore } from "redux";

import { Wallet } from "./types";

export type SiteStore = {
  wallet?: Wallet;
  walletError?: string;
};

type Action = {
  type: string;
  wallet?: Wallet;
  walletError?: string;
};

const store = createStore(
  (state: SiteStore = {}, action: Action = { type: "" }) => {
    switch (action.type) {
      case "CONNECT_WALLET":
        return {
          ...state,
          wallet: action?.wallet,
          walletError: null,
        };
      case "DISCONNECT_WALLET":
        return {
          ...state,
          wallet: null,
          walletError: action?.walletError,
        };
      default:
        return {
          ...state,
        };
    }
  }
);

export default store;
