import { fireEvent, render, screen, waitFor } from "../../lib/testing";
import NumberInput from "../numberInput";

describe("NumberInput", () => {
  it("accepts digits as inputs", () => {
    render(<NumberInput />);

    const inputElement = screen.getByTestId("NumberInput__input");

    fireEvent.change(inputElement, {
      target: {
        value: "1",
      },
    });

    expect(inputElement).toHaveValue("1");
  });

  it("ignores letters as inputs", () => {
    render(<NumberInput />);

    const inputElement = screen.getByTestId("NumberInput__input");

    fireEvent.change(inputElement, {
      target: {
        value: "13r",
      },
    });

    expect(inputElement).toHaveValue("13");
  });

  it("accepts '.' characters", () => {
    render(<NumberInput />);

    const inputElement = screen.getByTestId("NumberInput__input");

    fireEvent.change(inputElement, {
      target: {
        value: "13.1235",
      },
    });

    expect(inputElement).toHaveValue("13.1235");
  });

  it("trims trailing '.' characters on blur", () => {
    render(<NumberInput />);

    const inputElement = screen.getByTestId("NumberInput__input");

    fireEvent.change(inputElement, {
      target: {
        value: "13.",
      },
    });

    expect(inputElement).toHaveValue("13.");

    fireEvent.blur(inputElement);

    expect(inputElement).toHaveValue("13");
  });
});
