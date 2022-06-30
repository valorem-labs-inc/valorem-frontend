import * as React from "react";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { render, RenderOptions } from "@testing-library/react";
import { getDefaultProvider, Wallet, providers } from "ethers";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MockConnector } from "@wagmi/core/connectors/mock";
import { sign } from "crypto";
import { JsonRpcSigner } from "@ethersproject/providers";

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "http://127.0.0.1:8545",
      }),
    }),
  ]
);

function getSigner() {
  const p = new providers.JsonRpcProvider("http://127.0.0.1:8545");

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  return p.getSigner(wallet.address);
}

const mockConnector = new MockConnector({
  chains,
  options: {
    signer: getSigner(),
  },
});

const client = createClient({
  autoConnect: true,
  connectors: [mockConnector],
  provider,
});

const AllTheProviders: React.FC = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
