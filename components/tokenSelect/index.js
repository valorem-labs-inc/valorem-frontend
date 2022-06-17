import React from "react";
import PropTypes from "prop-types";
import Select from "../select";
import tokens from "../../lib/tokens.json";

class TokenSelect extends React.Component {
  state = {};

  render() {
    const { value, onChange } = this.props;
      // TODO(This should branch based on network selected in metamask)
    const tokensForEnvironment = tokens && tokens["development"];

    return (
      <React.Fragment>
        <Select
          search
          placeholder="Select a token..."
          value={value}
          onChange={onChange}
          options={tokensForEnvironment?.map(
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

TokenSelect.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default TokenSelect;
