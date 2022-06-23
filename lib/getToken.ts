import tokens from "./tokens";
import { Token } from "./types";

const getToken = (address = ""): Token => {
  const searchForAddress = address.toLowerCase();
  return tokens.find((item) => item.address.toLowerCase() === searchForAddress);
};

export default getToken;
