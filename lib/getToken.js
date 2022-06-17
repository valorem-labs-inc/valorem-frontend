import tokens from "./tokens.json";

export default (address = "") => {
  // TODO(This should branch based on network selected in metamask)
  const tokensForEnvironment = tokens["development"];
  return tokensForEnvironment?.find(item => {
    return item.address.toLowerCase() === address.id;
  });
};
