import React from "react";
import PropTypes from "prop-types";

import StyledWarning from "./index.css.js";

class Warning extends React.Component {
  state = {};

  render() {
    const { children, ...props } = this.props;
    return <StyledWarning {...props}>{children}</StyledWarning>;
  }
}

Warning.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Warning;
