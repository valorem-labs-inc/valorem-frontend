import React from "react";
import PropTypes from "prop-types";

import StyledBlankState from "./index.css";

class BlankState extends React.Component {
  state = {};

  render() {
    const { title, subtitle } = this.props;

    return (
      <StyledBlankState>
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </StyledBlankState>
    );
  }
}

BlankState.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default BlankState;
