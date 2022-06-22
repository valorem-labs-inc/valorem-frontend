import React from "react";

import StyledAmount from "./index.css";

export type AmountProps = {
  id: string;
  label: string;
  paddingLeft: string;
  min?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

class Amount extends React.Component<AmountProps> {
  state = {};

  render() {
    const { id, label, paddingLeft, value, onChange, ...props } = this.props;
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

export default Amount;
