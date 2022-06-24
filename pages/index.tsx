/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useConnect, useNetwork } from "wagmi";

import Button from "../components/button";
import StyledIndex from "./index.css";
import ConnectWalletModal from "../components/connectWalletModal";

const Index: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const { data: account } = useAccount();

  const { activeChain } = useNetwork();

  const { isConnecting } = useConnect();

  useEffect(() => {
    if (account && activeChain && !activeChain.unsupported) {
      router.push("/vault/options");
    }
  }, [account, router, activeChain]);

  return (
    <Fragment>
      <StyledIndex>
        <img className="logo" src="/logo.png" alt="Valorem" />
        <Button
          disabled={isConnecting || !activeChain || activeChain.unsupported}
          onClick={() => setModalOpen(true)}
          theme="purple-blue"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
        {(!activeChain || activeChain.unsupported) && (
          <p className="wallet-error">
            <strong>Error:</strong> Unsupported network. Double-check your
            network is Rinkeby in Metamask and try again.
          </p>
        )}
      </StyledIndex>
      <ConnectWalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Fragment>
  );
};

export default Index;
