import { NextPage } from "next";
import dynamic from "next/dynamic";
import NavBar from "../components/navbar";

const ConnectWalletView = dynamic(
  () => import("../components/connectWalletView"),
  {
    ssr: false,
  }
);

const Index: NextPage = () => {
  return (
    <div>
      <NavBar />
      <ConnectWalletView />
    </div>
  );
};

export default Index;
