import React from "react";

import StyledLayout from "./layout.css.js";

class Layout extends React.Component {
  state = {};

  render() {
    const { children } = this.props;

    return (
      <StyledLayout>
        <nav>
          <a className="logo" href="/">
            <img src="/logo.png" alt="Valorem" />
          </a>
        </nav>
        {children}
      </StyledLayout>
    );
  }
}

Layout.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Layout;
