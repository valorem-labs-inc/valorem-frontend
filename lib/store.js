import { createStore } from "redux";

const store = createStore((state = {}, action = {}) => {
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
});

export default store;
