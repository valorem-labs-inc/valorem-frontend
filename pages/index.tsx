import { NextPage } from "next";
import dynamic from "next/dynamic";

const ConnectWalletView = dynamic(
  () => import("../components/connectWalletView"),
  {
    ssr: false,
  }
);

const Index: NextPage = () => {
  return <ConnectWalletView />;
};

export default Index;
