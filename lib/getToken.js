import tokens from "./tokens.json";

export default (address = "") => {
  const tokensForEnvironment = tokens[process.env.NODE_ENV];
  const token = tokensForEnvironment?.find((tokenForEnvironment) => {
    return tokenForEnvironment?.address?.toLowerCase() === address;
  });
  return token;
};
