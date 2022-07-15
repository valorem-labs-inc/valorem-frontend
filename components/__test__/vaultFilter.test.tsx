import { fireEvent, render, screen } from "../../lib/testing";
import VaultFilter from "../vaultFilter";

describe("VaultFilter", () => {
  it("should display 'props.value'", () => {
    const value = {
      label: "Current Value",
      value: "currentValue",
    };

    render(<VaultFilter filters={[]} value={value} />);

    const buttonElement = screen.getByTestId("VaultFilter__button");

    expect(buttonElement).toHaveTextContent(value.label);
  });

  it("clicking the button should open the filter menu", () => {
    const value = {
      label: "Current Value",
      value: "currentValue",
    };

    render(<VaultFilter filters={[]} value={value} />);

    const buttonElement = screen.getByTestId("VaultFilter__button");

    expect(screen.queryByTestId("VaultFilter__menu")).toBeNull();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("VaultFilter__menu")).toBeInTheDocument();
  });

  it("when the menu is open is should display options passed", () => {
    const filters = [
      {
        value: "expiryDate",
        label: "expiry date",
      },
      {
        value: "exerciseDate",
        label: "exercise date",
      },
    ];

    render(<VaultFilter filters={filters} value={filters[0]} />);

    const buttonElement = screen.getByTestId("VaultFilter__button");

    fireEvent.click(buttonElement);

    const menuElement = screen.getByTestId("VaultFilter__menu");

    expect(menuElement.childElementCount).toEqual(filters.length);
    expect(menuElement.children[0]).toHaveTextContent(filters[0].label);
    expect(menuElement.children[1]).toHaveTextContent(filters[1].label);
  });

  it("selecting an option on the menu should call 'props.onChange'", () => {
    const fn = jest.fn();

    const filters = [
      {
        value: "expiryDate",
        label: "expiry date",
      },
      {
        value: "exerciseDate",
        label: "exercise date",
      },
    ];

    render(<VaultFilter filters={filters} value={filters[0]} onChange={fn} />);

    const buttonElement = screen.getByTestId("VaultFilter__button");

    fireEvent.click(buttonElement);

    const menuElement = screen.getByTestId("VaultFilter__menu");

    fireEvent.click(menuElement.children[0]);

    expect(fn).toHaveBeenCalled();
  });
});
