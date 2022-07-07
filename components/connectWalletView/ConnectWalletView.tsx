/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import Button from "../button";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 460px;
  padding: 0px 16px;

  .directions {
    padding-bottom: 24px;
    padding-top: 52px;
    text-align: center;
  }

  .directions h1 {
    font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    color: #111f2e; // black
    font-size: 32px;
    letter-spacing: -0.06em;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .directions p {
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
  }

  .step {
    padding: 24px 0;
    text-align: center;
  }

  .step h2 {
    color: var(--gray-500);
    font-size: 14px;
    line-height: 1.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }

  .options {
    display: flex;
    gap: 16px;
  }

  .subheading {
    color: var(--gray-600);
    padding-top: 4px;
  }

  ${Button} {
    font-size: 24px;
    padding: 24px 16px;
    width: 100%;
  }

  .warning {
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
  const [showWarning, setShowWarning] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  const { connector: activeConnector } = useAccount();
  const { connect, connectors, reset } = useConnect({
    onError: () => {
      setShowWarning(true);
      reset();
    },
    onSuccess: () => {
      setShowWarning(false);
    },
  });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const router = useRouter();

  useEffect(() => {
    if (activeConnector && chain && !chain.unsupported) {
      setCanLaunch(true);
    } else {
      setCanLaunch(false);
    }
  }, [activeConnector, chain]);

  return (
    <Wrapper>
      <div className="directions">
        <h1>Connect wallet</h1>
        <p>
          Sign into the Valorem app by connecting your wallet. Our app is still
          in beta mode, so you can only connect to the Rinkeby test network.
        </p>
      </div>
      {showWarning && (
        <div className="warning">
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
            Failed to connect to Rinkeby network with MetaMask wallet. Please
            try again.
          </p>
        </div>
      )}
      <div className="step">
        <h2>Connect Wallet</h2>
        <div className="options">
          {connectors.map((connector) => (
            <Option
              data-testid="wallet-option"
              key={connector.id}
              onClick={() => {
                if (activeConnector?.id !== connector.id) {
                  connect({ connector });
                }
              }}
              selected={activeConnector && activeConnector.id === connector.id}
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
              <span data-testid="wallet-option__name">{connector.name}</span>
            </Option>
          ))}
        </div>
      </div>
      <div className="step">
        <h2>Select Network</h2>
        <div className="options">
          <Option
            onClick={() => switchNetwork(4)}
            selected={chain && chain.id === 4}
            data-testid="network-select--rinkeby"
          >
            {chain && chain.id === 4 && (
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
            <p>Rinkeby</p>
            <p className="subheading">Learn to use Valorem with fake money</p>
          </Option>
          <Option disabled data-testid="network-select--mainnet">
            <div className="icon">
              <img alt="Ethereum mainnet logo" src="/mainnet-logo.png" />
            </div>
            <p>Ethereum Mainnet</p>
            <p className="subheading">
              Write and trade options using real money
            </p>
          </Option>
        </div>
      </div>
      <div>
        <Button
          data-testid="cta"
          disabled={!canLaunch}
          theme="purple-blue"
          onClick={() => router.push("/vault/options")}
        >
          Launch
        </Button>
      </div>
    </Wrapper>
  );
};

export default ConnectWalletView;
