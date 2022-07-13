import { NextPage } from "next";
import dynamic from "next/dynamic";
import NavBar from "../../components/navbar";
import VaultNavigation from "../../components/vaultNavigation";

const VaultView = dynamic(() => import("../../components/vaultView"), {
  ssr: false,
});

const Vault: NextPage = () => {
  return (
    <div>
      <NavBar />
      <div
        style={{
          display: "flex",
          maxWidth: "1224px",
          margin: "64px auto",
          padding: "0 16px",
          gap: "48px",
        }}
      >
        <div style={{ width: "270px" }}>
          <VaultNavigation />
        </div>
        <div style={{ flex: "1" }}>
          <VaultView />
        </div>
      </div>
    </div>
  );
};

export default Vault;
