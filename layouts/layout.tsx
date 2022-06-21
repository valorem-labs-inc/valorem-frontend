import React from "react";

import StyledLayout from "./layout.css.ts";

type LayoutState = {
};

type LayoutProps = {
  children: React.ReactNode;
};

class Layout extends React.Component<LayoutProps, LayoutState> {
  state: LayoutState = {};

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

export default Layout;
