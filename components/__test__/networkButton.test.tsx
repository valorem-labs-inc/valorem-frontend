import { useNetwork, useSwitchNetwork } from "wagmi";
import {
  AutoConnect,
  render,
  renderHook,
  screen,
  waitFor,
} from "../../lib/testing";
import NetworkButton from "../networkButton";

describe("NetworkButton", () => {
  it("displays the name of the currently selected network", async () => {
    render(
      <AutoConnect>
        <NetworkButton />
      </AutoConnect>
    );

    const buttonElement = await waitFor(() =>
      screen.getByTestId("NetworkButton")
    );

    expect(buttonElement).toHaveTextContent("Foundry");
  });
});
