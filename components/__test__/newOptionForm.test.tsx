import moment from "moment";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  AutoConnect,
  waitFor,
  getQueriesForElement,
} from "../../lib/testing";
import NewOptionForm from "../newOptionForm";

const tokenOptions = [
  {
    value: "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15",
    label: "Wrapped Ether (WETH)",
  },
  {
    value: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
    label: "Dai Stablecoin (DAI)",
  },
  {
    value: "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85",
    label: "Maker (MKR)",
  },
  {
    value: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    label: "Uniswap (UNI)",
  },
];

describe("NewOptionForm", () => {
  it("can select an exercise asset", async () => {
    render(
      <AutoConnect>
        <NewOptionForm />
      </AutoConnect>
    );

    await waitFor(() => screen.getByText("Configure exercise asset"));

    // Select an exercise asset
    expect(screen.getAllByTestId("Select__button")[0]).toHaveTextContent(
      "WETH (Wrapped Ether)"
    );

    fireEvent.click(screen.getAllByTestId("Select__button")[0]);

    fireEvent.click(screen.getByText("MKR (Maker)"));

    expect(screen.getAllByTestId("Select__button")[0]).toHaveTextContent(
      "MKR (Maker)"
    );

    // Enter exercise asset amount
    expect(screen.getAllByTestId("NumberInput__input")[0]).toHaveValue("");

    fireEvent.change(screen.getAllByTestId("NumberInput__input")[0], {
      target: {
        value: "1.5",
      },
    });

    expect(screen.getAllByTestId("NumberInput__input")[0]).toHaveValue("1.5");

    // Select an underlying asset
    expect(screen.getAllByTestId("Select__button")[1]).toHaveTextContent(
      "DAI (Dai Stablecoin)"
    );

    fireEvent.click(screen.getAllByTestId("Select__button")[1]);

    fireEvent.click(screen.getByText("UNI (Uniswap)"));

    expect(screen.getAllByTestId("Select__button")[1]).toHaveTextContent(
      "UNI (Uniswap)"
    );

    // Enter underlying asset amount
    expect(screen.getAllByTestId("NumberInput__input")[1]).toHaveValue("");

    fireEvent.change(screen.getAllByTestId("NumberInput__input")[1], {
      target: {
        value: "20",
      },
    });

    expect(screen.getAllByTestId("NumberInput__input")[1]).toHaveValue("20");

    // Enter number of contracts
    expect(screen.getAllByTestId("NumberInput__input")[2]).toHaveValue("");

    fireEvent.change(screen.getAllByTestId("NumberInput__input")[2], {
      target: {
        value: "2",
      },
    });

    expect(screen.getAllByTestId("NumberInput__input")[2]).toHaveValue("2");

    // Select exercise from date
    const exerciseDateGroup = getQueriesForElement(
      screen.getByTestId("exercise-date-group")
    );

    const exerciseDateInput = exerciseDateGroup.getByDisplayValue(
      moment().format("dddd, MMMM D YYYY")
    );

    fireEvent.click(exerciseDateInput);

    const nextDate = moment().add(1, "day");
    fireEvent.click(
      exerciseDateGroup.getByTestId(`td-${nextDate.month()}-${nextDate.date()}`)
    );

    expect(exerciseDateInput).toHaveDisplayValue(
      nextDate.format("dddd, MMMM D YYYY")
    );

    // Select expiry date
    const expiryDateGroup = getQueriesForElement(
      screen.getByTestId("expiry-date-group")
    );

    const expiryDateInput = expiryDateGroup.getByDisplayValue(
      moment().add(7, "days").format("dddd, MMMM D YYYY")
    );

    fireEvent.click(expiryDateInput);

    const nextExpiryDate = moment().add(6, "days");

    fireEvent.click(
      expiryDateGroup.getByTestId(
        `td-${nextExpiryDate.month()}-${nextExpiryDate.date()}`
      )
    );

    expect(expiryDateInput).toHaveDisplayValue(
      nextExpiryDate.format("dddd, MMMM D YYYY")
    );
  });
});
