import { NextPage } from "next";
import dynamic from "next/dynamic";
import styled from "styled-components";
import VaultNavigation from "../../../../components/vaultNavigation";

const NewOptionView = dynamic(
  () => import("../../../../components/newOptionView"),
  {
    ssr: false,
  }
);

const Wrapper = styled.div`
  display: flex;
  max-width: 1224px;
  margin: 32px auto 0;
  padding: 0 16px;
  gap: 48px;

  .nav-area {
    display: none;
    flex-grow: 0;
    flex-shrink: 0;
    width: 270px;
  }

  .content-area {
    flex: 1;
  }

  @media (min-width: 640px) {
    margin-top: 64px;

    .nav-area {
      display: block;
    }
  }
`;

const NewOptionPage: NextPage = () => {
  return (
    <Wrapper>
      <div className="nav-area">
        <VaultNavigation />
      </div>
      <div className="content-area">
        <NewOptionView />
      </div>
    </Wrapper>
  );
};

export default NewOptionPage;
