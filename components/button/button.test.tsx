import React from "react";
import { render, screen } from "../../lib/testing";
import Button from "./index";

describe("button component", () => {
  it("should render", () => {
    render(<Button theme="purple-blue">Hello</Button>);

    const btn = screen.getByText("Hello");

    expect(btn).toMatchSnapshot();
  });
});
