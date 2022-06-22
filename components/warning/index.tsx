import React from "react";

import StyledWarning from "./index.css";

type WarningProps = {
  center?: boolean;
  children: React.ReactNode;
};

type WarningState = {};

class Warning extends React.Component<WarningProps, WarningState> {
  state: WarningState = {};

  render() {
    const { children, center } = this.props;
    return <StyledWarning center={center}>{children}</StyledWarning>;
  }
}

export default Warning;
