import { fireEvent, render, screen, cleanup } from "../../lib/testing";
import Select from "../select";

const value = {
  value: "DAI",
  label: "DAI",
};

const options = [
  {
    value: "option-one",
    label: "Option One",
  },
  {
    value: "option-two",
    label: "Option Two",
  },
  {
    value: "option-three",
    label: "Option Three",
  },
];

describe("Select component", () => {
  beforeEach(() => {
    render(<Select value={value} options={options} />);
  });

  it("the button displays 'props.value'", () => {
    const buttonElement = screen.getByTestId("Select__button");

    expect(buttonElement).toHaveTextContent(value.label);
  });

  it("should display 'props.options' in the menu", () => {
    const buttonElement = screen.getByTestId("Select__button");

    fireEvent.click(buttonElement);

    const optionElements = screen.getAllByTestId("Select__option");

    expect(optionElements).toHaveLength(options.length);

    for (let i = 0; i < optionElements.length; i++) {
      const optionElement = optionElements[i];
      const optionObject = options[i];

      expect(optionElement).toHaveTextContent(optionObject.label);
    }
  });

  it("should call 'props.onChange' when an option is clicked", () => {
    cleanup();

    const fn = jest.fn();

    render(<Select value={value} options={options} onChange={fn} />, {});

    const buttonElement = screen.getByTestId("Select__button");

    fireEvent.click(buttonElement);

    const optionElements = screen.getAllByTestId("Select__option");
    const optionElement = optionElements[0];

    fireEvent.click(optionElement);

    expect(fn).toHaveBeenCalledWith(options[0]);
  });

  it("should not display the menu initially", () => {
    const menuElement = screen.queryByTestId("Select__menu");

    expect(menuElement).toBeNull();
  });

  it("should display the menu when the button is clicked while the menu isn't currently visible", () => {
    const buttonElement = screen.getByTestId("Select__button");

    expect(screen.queryByTestId("Select__menu")).toBeNull();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("Select__menu")).toBeInTheDocument();
  });

  it("should hide the menu when the button is clicked while the menu is currently visible", () => {
    const buttonElement = screen.getByTestId("Select__button");

    expect(screen.queryByTestId("Select__menu")).toBeNull();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("Select__menu")).toBeInTheDocument();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("Select__menu")).toBeNull();
  });

  it("should hide the menu when a menu option is clicked", () => {
    const buttonElement = screen.getByTestId("Select__button");

    expect(screen.queryByTestId("Select__menu")).toBeNull();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("Select__menu")).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId("Select__option")[0]);

    expect(screen.queryByTestId("Select__menu")).toBeNull();
  });

  it("should hide the menu when an area outside of the menu is clicked", () => {
    const buttonElement = screen.getByTestId("Select__button");

    expect(screen.queryByTestId("Select__menu")).toBeNull();

    fireEvent.click(buttonElement);

    expect(screen.queryByTestId("Select__menu")).toBeInTheDocument();

    fireEvent.click(document.body);

    expect(screen.queryByTestId("Select__menu")).toBeNull();
  });
});
