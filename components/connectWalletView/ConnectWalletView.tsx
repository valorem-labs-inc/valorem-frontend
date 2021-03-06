/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
} from "wagmi";
import Button from "../button";

const Wrapper = styled.div`
  max-width: 492px;
  margin: 0 auto;
  padding: 0 16px;

  .connect {
    margin: 48px 0px;
  }

  .step {
    margin: 32px 0;
    text-align: center;
    line-height: 1.6;
  }

  .step h1 {
    font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    color: var(--black); // black
    font-size: 32px;
    letter-spacing: -0.06em;
    line-height: 1.1;
    margin: 16px 0;
  }

  .step h2 {
    color: var(--gray-500);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 16px 0;
  }

  .step p {
    font-size: 16px;
    color: var(--gray-700);
  }

  .options {
    display: flex;
    gap: 16px;
  }

  ${Button} {
    font-size: 24px;
    padding: 24px 16px;
    width: 100%;
  }

  ${Button}:not(:disabled) {
    animation: connect-wallet-button 3s infinite;
    transition: transform 0.3s ease-in-out;
    transform: scale(1, 1);
  }

  .error {
    background-color: #e2b3b3;
    border-radius: 8px;
    color: #654040;
    font-size: 16px;
    line-height: 1.6;
    padding: 16px;
    display: flex;
    gap: 16px;
  }
`;

const Option = styled.button<{ selected?: boolean }>`
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  border: ${(props) =>
    props.selected ? "2px solid var(--purple-blue)" : "1px solid #dde3ec"};
  color: var(--gray-800);
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  transition: border-color ease-in-out 50ms;
  position: relative;

  h3 {
    color: var(--gray-800);
    margin: 4px 0;
  }

  h4 {
    color: var(--gray-600);
    margin: 4px 0;
  }

  &:hover:not(:disabled) {
    border-color: var(--purple-blue);
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.25;
  }

  .selected-indicator {
    display: ${(props) => (props.selected ? "block" : "none")};
    height: 16px;
    position: absolute;
    right: 16px;
    top: 16px;
    width: 16px;
  }

  .icon {
    align-items: center;
    background-color: #dde3ec;
    border-radius: 1000px;
    display: inline-flex;
    height: 48px;
    justify-content: center;
    margin: 0 auto 16px;
    padding: 12px;
    width: 48px;
  }

  img {
    height: 32px;
    width: 32px;
  }
`;

const ConnectWalletView: FC = () => {
  const [canLaunch, setCanLaunch] = useState(false);
  const [showError, setShowError] = useState(false);
  const { isConnected, connector: activeConnector } = useAccount();
  // TODO(onMutate, we should tell the user we are attempting to connect)
  // The way to do this might be to grey out and draw a loading animation over the connection view
  // TODO(When network selection is unsupported by the wallet, we should display an amber warning for the user)
  // to make the selection themselves
  // TODO(Figure out why frame masquerading as metamask gets "Error: not connected" after 8s)
  // Low priority though, since not officially supported
  const { connect, connectors, reset } = useConnect({
    onError: () => {
      setShowError(true);
      reset();
    },
    onSuccess: () => {
      setShowError(false);
    },
  });

  const { disconnect } = useDisconnect();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const router = useRouter();

  useEffect(() => {
    if (activeConnector && chain && !chain.unsupported && isConnected) {
      setCanLaunch(true);
    } else {
      setCanLaunch(false);
    }
  }, [activeConnector, chain, isConnected]);

  return (
    <Wrapper>
      <div className="connect">
        <div className="steps">
          <div className="step">
            <h1>Get started</h1>
            <p>
              Sign into the Valorem app by connecting your wallet. Our app is
              still in beta, so you can only connect with the Rinkeby test
              network.
            </p>
          </div>
          {showError && (
            <div className="error">
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.59043 0.991406C7.22325 0.3585 8.08106 0.00292969 8.97637 0.00292969H15.0232C15.9186 0.00292969 16.7764 0.3585 17.4092 0.991406L23.0061 6.59063C23.6389 7.22344 23.9951 8.08125 23.9951 8.97656V15.0234C23.9951 15.9187 23.6389 16.7766 23.0061 17.4094L17.4092 23.0062C16.7764 23.6391 15.9186 23.9953 15.0232 23.9953H8.97637C8.08106 23.9953 7.22325 23.6391 6.59043 23.0062L0.991214 17.4094C0.358495 16.7766 0.00292969 15.9187 0.00292969 15.0234V8.97656C0.00292969 8.08125 0.358495 7.22344 0.991214 6.59063L6.59043 0.991406ZM10.8748 7.08281V12.3328C10.8748 12.9984 11.3764 13.4578 11.9998 13.4578C12.6232 13.4578 13.1248 12.9984 13.1248 12.3328V7.08281C13.1248 6.50156 12.6232 5.95781 11.9998 5.95781C11.3764 5.95781 10.8748 6.50156 10.8748 7.08281ZM11.9998 14.9578C11.1701 14.9578 10.4998 15.6703 10.4998 16.4578C10.4998 17.3297 11.1701 17.9578 11.9998 17.9578C12.8295 17.9578 13.4998 17.3297 13.4998 16.4578C13.4998 15.6703 12.8295 14.9578 11.9998 14.9578Z"
                    fill="#C73E3E"
                  />
                </svg>
              </div>
              <p>
                Failed to connect to {chain?.name || "network"} with{" "}
                {activeConnector?.name || "wallet"}. Please try again.
              </p>
            </div>
          )}
          <div className="step">
            <h2>Connect Wallet</h2>
            <div className="options">
              {connectors.map((connector) => (
                <Option
                  data-testid="wallet-option"
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    if (
                      activeConnector &&
                      activeConnector.id === connector.id &&
                      isConnected
                    ) {
                      // The user is pressing the selected connector, lets disconnect
                      disconnect();
                    } else {
                      connect({ connector });
                    }
                  }}
                  selected={
                    activeConnector && activeConnector.id === connector.id
                  }
                >
                  {activeConnector && activeConnector.id === connector.id && (
                    <img
                      alt=""
                      className="selected-indicator"
                      data-testid="wallet-option__selected-indicator"
                      src="/check-icon.svg"
                    />
                  )}
                  <div className="icon">
                    <img
                      alt={`${connector.name} logo`}
                      src={`/${connector.name.toLowerCase()}.svg`}
                    />
                  </div>
                  <h3 data-testid="wallet-option__name">{connector.name}</h3>
                </Option>
              ))}
            </div>
          </div>
          <div className="step">
            <h2>Select Network</h2>
            <div className="options">
              <Option
                disabled={!isConnected || (!switchNetwork && chain.id !== 4)}
                onClick={() => {
                  if (chain.id !== 4 && typeof switchNetwork === "function") {
                    switchNetwork(4);
                  }
                }}
                selected={chain?.id === 4}
                data-testid="network-select--rinkeby"
              >
                {chain?.id === 4 && (
                  <img
                    alt=""
                    data-testid="selected-indicator"
                    className="selected-indicator"
                    src="/check-icon.svg"
                  />
                )}
                <div className="icon">
                  <img alt="Rinkeby logo" src="/rinkeby-logo.png" />
                </div>
                <h3>Rinkeby</h3>
                <h4>Learn to use Valorem with fake tokens</h4>
              </Option>
              <Option disabled data-testid="network-select--mainnet">
                <div className="icon">
                  <img alt="Ethereum mainnet logo" src="/mainnet-logo.png" />
                </div>
                <h3>Ethereum Mainnet</h3>
                <h4>Write and trade options using real tokens</h4>
              </Option>
            </div>
          </div>
          <div>
            <Button
              data-testid="cta"
              disabled={!canLaunch}
              theme="purple-blue"
              onClick={() => router.push("/vault")}
            >
              Launch
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ConnectWalletView;
