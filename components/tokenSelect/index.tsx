import React from "react";

import tokens from "../../lib/tokens";
import Select from "../select";

type TokenSelectState = {};

type TokenSelectProps = {
  value: string;
  onChange: (value: string, label: string) => void;
};

class TokenSelect extends React.Component<TokenSelectProps, TokenSelectState> {
  state: TokenSelectState = {};

  render() {
    const { value, onChange } = this.props;
    return (
      <React.Fragment>
        <Select
          placeholder="Select a token..."
          value={value}
          onChange={onChange}
          options={tokens.map(
            ({ address, name, symbol, logoURI }) => {
              // NOTE: Removed logoURI as the data is inconsistent and a lot of links in the token
              // list just return 404s.
              return { value: address, label: `${symbol} - ${name}` };
            }
          )}
        />
      </React.Fragment>
    );
  }
}

export default TokenSelect;
