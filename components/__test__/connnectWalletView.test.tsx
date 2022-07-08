import React from "react";
import {
  render,
  screen,
  fireEvent,
  getQueriesForElement,
  waitFor,
} from "../../lib/testing";
import ConnectWalletView from "../connectWalletView";

describe("ConnectWalletView", () => {
  it("displays a wallet connect button for each enabled connector", () => {
    render(<ConnectWalletView />);

    const walletOptions = screen.getAllByTestId("wallet-option");

    expect(walletOptions.length).toEqual(1);

    for (const walletOption of walletOptions) {
      const nameElement = getQueriesForElement(walletOption).getByTestId(
        "wallet-option__name"
      );

      const imageElement =
        getQueriesForElement(walletOption).getByAltText("Mock logo");

      expect(nameElement).toHaveTextContent("Mock");
      expect(imageElement).toHaveAttribute("src", "/mock.svg");
    }
  });

  it("requires the user to connect a wallet and switch their network to rinkeby", async () => {
    render(<ConnectWalletView />);

    const walletOptions = screen.getAllByTestId("wallet-option");

    const mockConnectorButton = walletOptions[0];
    const rinkebyButton = screen.getByTestId("network-select--rinkeby");
    const launchButton = screen.getByTestId("cta");

    // no wallet selected
    expect(
      getQueriesForElement(mockConnectorButton).queryByTestId(
        "wallet-option__selected-indicator"
      )
    ).toBeNull();

    // rinkeby not selected
    expect(
      getQueriesForElement(rinkebyButton).queryByTestId("selected-indicator")
    ).toBeNull();

    // launch button disabled
    expect(launchButton).toBeDisabled();

    fireEvent.click(mockConnectorButton);

    // wallet connector connected
    await waitFor(() =>
      expect(
        getQueriesForElement(mockConnectorButton).queryByTestId(
          "wallet-option__selected-indicator"
        )
      ).toBeInTheDocument()
    );

    // rinkeby not selected
    expect(
      getQueriesForElement(rinkebyButton).queryByTestId("selected-indicator")
    ).toBeNull();

    // launch button disabled
    expect(launchButton).toBeDisabled();

    fireEvent.click(rinkebyButton);

    await waitFor(() =>
      expect(
        getQueriesForElement(rinkebyButton).queryByTestId("selected-indicator")
      ).not.toBeNull()
    );

    expect(launchButton).toBeEnabled();
  });
});
