import * as React from "react";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { render, RenderOptions } from "@testing-library/react";
import { Wallet, providers } from "ethers";
import {
  chain,
  configureChains,
  createClient,
  useAccount,
  useConnect,
  WagmiConfig,
} from "wagmi";
import { MockConnector } from "@wagmi/core/connectors/mock";

export const AutoConnect: React.FC = ({ children }) => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  React.useEffect(() => {
    if (!isConnected) {
      connect({
        connector: connectors[0],
      });
    }
  }, [isConnected, connect, connectors]);

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
};

interface RenderHookOptions<Props> {
  initialProps?: Props;
  wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>;
}

export function renderHook<Result, Props>(
  renderCallback: (initialProps: Props) => Result,
  options: RenderHookOptions<Props> = {}
) {
  const { initialProps } = options;

  const result = React.createRef<Result>();

  function TestComponent({ renderCallbackProps }) {
    const pendingResult = renderCallback(renderCallbackProps);

    React.useEffect(() => {
      // @ts-ignore
      result.current = pendingResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />
    );
  }

  return { result, rerender, unmount };
}

const { chains, provider, webSocketProvider } = configureChains(
  [chain.rinkeby],
  [
    // publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "http://127.0.0.1:8545",
      }),
    }),
  ]
);

const AllTheProviders: React.FC = ({ children }) => {
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
      chainId: 4,
      signer: getSigner(),
    },
  });

  const client = createClient({
    // autoConnect: true,
    connectors: [mockConnector],
    provider,
    webSocketProvider,
  });

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
