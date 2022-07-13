import { NextPage } from "next";
import dynamic from "next/dynamic";
import styled from "styled-components";
import VaultNavigation from "../../components/vaultNavigation";

const VaultView = dynamic(() => import("../../components/vaultView"), {
  ssr: false,
});

const Wrapper = styled.div`
  display: flex;
  max-width: 1224px;
  margin: 64px auto 0;
  padding: 0 16px;
  gap: 48px;

  .nav-area {
    width: 270px;
  }

  .content-area {
    flex: 1;
  }
`;

const Vault: NextPage = () => {
  return (
    <Wrapper>
      <div className="nav-area">
        <VaultNavigation />
      </div>
      <div className="content-area">
        <VaultView />
      </div>
    </Wrapper>
  );
};

export default Vault;
