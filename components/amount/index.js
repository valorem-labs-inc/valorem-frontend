import React from "react";
import PropTypes from "prop-types";

import StyledAmount from "./index.css.js";

class Amount extends React.Component {
  state = {};

  render() {
    const { id, label, paddingLeft, min, value, onChange, ...props } =
      this.props;
    return (
      <StyledAmount paddingLeft={paddingLeft}>
        <div className="input-cap">{label}</div>
        <input
          {...props}
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          name="amount"
          placeholder="100"
        />
      </StyledAmount>
    );
  }
}

Amount.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Amount;
