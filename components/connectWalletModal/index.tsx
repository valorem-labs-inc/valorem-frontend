/* eslint-disable @next/next/no-img-element */
import type { FC } from "react";
import { useConnect } from "wagmi";
import Styled from "./index.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectWalletModal: FC<Props> = ({ isOpen, onClose }) => {
  const { connect, connectors, isConnecting } = useConnect({
    onConnect: () => {
      onClose();
    },
  });

  const metamask = connectors.find((c) => c.id === "metaMask");

  const walletConnect = connectors.find((c) => c.id === "walletConnect");

  const coinbase = connectors.find((c) => c.id === "coinbaseWallet");

  return (
    <Styled isOpen={isOpen}>
      <div className="overlay"></div>
      <div
        className="modal-layer"
        onClick={(e) => {
          // @ts-ignore
          if (e.target.className === "modal-position") {
            onClose();
          }
        }}
      >
        <div className="modal-position">
          <div className="modal">
            <div className="options">
              <div className="option" onClick={() => connect(metamask)}>
                <img
                  className="option__logo"
                  src="/metamask.svg"
                  alt="MetaMask logo"
                />
                <p className="option__name">MetaMask</p>
                <p className="option__text">Connect to your MetaMask Wallet</p>
              </div>
              <div className="option" onClick={() => connect(walletConnect)}>
                <img
                  className="option__logo"
                  src="/wallet-connect.svg"
                  alt="WalletConnect logo"
                />
                <p className="option__name">WalletConnect</p>
                <p className="option__text">
                  Scan with WalletConnect to connect
                </p>
              </div>
              <div className="option">
                <img
                  className="option__logo"
                  src="/frame.png"
                  alt="Frame logo"
                />
                <p className="option__name">Frame</p>
                <p className="option__text">Connect with your Frame account</p>
              </div>
              <div className="option" onClick={() => connect(coinbase)}>
                <img
                  className="option__logo"
                  src="/coinbase-wallet.svg"
                  alt="Coinbase Wallet logo"
                />
                <p className="option__name">Coinbase Wallet</p>
                <p className="option__text">
                  Scan with Coinbase Wallet to connect
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default ConnectWalletModal;
