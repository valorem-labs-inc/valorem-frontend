import React from "react";
import { render, screen, fireEvent } from "../../lib/testing";
import NewOptionView from "../newOptionView";

describe("NewOptionForm", () => {
  it("handles balance inputs", () => {
    render(<NewOptionView />);

    const balanceInput = screen.getByLabelText("Number of Contracts");

    // Should be 0 by default
    expect(balanceInput).toHaveValue(0);

    // Should reflect input values
    fireEvent.input(balanceInput, { target: { value: "23" } });
    expect(balanceInput).toHaveValue(23);

    // Should revert back to 0 if input is empty
    fireEvent.input(balanceInput, { target: { value: "" } });
    expect(balanceInput).toHaveValue(0);
  });
});
