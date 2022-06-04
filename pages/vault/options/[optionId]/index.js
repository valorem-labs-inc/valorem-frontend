import React from "react";
import Vault from "../../../../layouts/vault";

import StyledOption from "./index.css.js";

class Option extends React.Component {
  state = {};

  render() {
    return (
      <Vault>
        <StyledOption>
          <p>Option</p>
        </StyledOption>
      </Vault>
    );
  }
}

Option.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Option;
