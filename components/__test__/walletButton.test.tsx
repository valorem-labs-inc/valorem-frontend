import { render, screen, waitFor, AutoConnect } from "../../lib/testing";
import WalletButton from "../walletButton";

describe("WalletButton", () => {
  it("should display a formatted version of the connected address", async () => {
    render(
      <AutoConnect>
        <WalletButton />
      </AutoConnect>
    );

    const button = await waitFor(() => screen.getByTestId("WalletButton"));

    expect(button).toHaveTextContent("0xf39...266");
  });
});
