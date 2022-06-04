import tokens from "./tokens.json";

export default (address = "") => {
  const tokensForEnvironment = tokens[process.env.NODE_ENV];
  const token = tokensForEnvironment?.find(item => {
    return item.address.toLowerCase() === address.id;
  });
  return token;
};
