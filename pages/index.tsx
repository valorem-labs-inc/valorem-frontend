/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";

import Button from "../components/button";
import StyledIndex from "./index.css";
import ConnectWalletModal from "../components/connectWalletModal";

const Index: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const { data: account } = useAccount();

  const { isConnecting } = useConnect();

  useEffect(() => {
    if (account) {
      router.push("/vault/options");
    }
  }, [account, router]);

  return (
    <Fragment>
      <StyledIndex>
        <img className="logo" src="/logo.png" alt="Valorem" />
        <Button
          disabled={isConnecting}
          onClick={() => setModalOpen(true)}
          theme="purple-blue"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </StyledIndex>
      <ConnectWalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Fragment>
  );
};

export default Index;
