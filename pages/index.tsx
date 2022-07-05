import { NextPage } from "next";
import ConnectWalletView from "../components/connectWalletView";
import NavBar from "../components/navbar";

const Index: NextPage = () => {
  return (
    <div>
      <NavBar />
      <ConnectWalletView />
    </div>
  );
};

export default Index;
