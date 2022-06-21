import React from "react";

import StyledBlankState from "./index.css";

type BlankStateProps = {
  title: string;
  subtitle: string;
};

class BlankState extends React.Component<BlankStateProps> {
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

export default BlankState;
