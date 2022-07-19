import { NextPage } from "next";
import dynamic from "next/dynamic";
import ConnectedRoute from "../../../../components/connectedRoute";
import Vault from "../../../../layouts/vault";
import styled from "styled-components";
import VaultNavigation from "../../../../components/vaultNavigation";
import Select from "../../../../components/select";
import { TOKEN_MAP } from "../../../../lib/tokens";
import { useNetwork } from "wagmi";
import { useState } from "react";

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
  const { chain } = useNetwork();

  const tokens = chain ? TOKEN_MAP[chain.id] : [];

  const tokenOptions = tokens.reduce((acc, token) => {
    return [
      ...acc,
      {
        value: token.address,
        label: `${token.symbol} (${token.name})`,
      },
    ];
  }, []);

  const [value, setValue] = useState(tokenOptions[0]);

  if (!value) {
    return null;
  }

  return (
    <Wrapper>
      <div className="nav-area">
        <VaultNavigation />
      </div>
      <div className="content-area">
        <div style={{ width: "50%" }}>
          <Select
            value={value}
            options={tokenOptions}
            onChange={(nextValue) => setValue(nextValue)}
          />
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            nam id iusto quisquam placeat nulla deserunt? Ullam autem quisquam
            perferendis iusto ipsum corrupti dolorem, laudantium consectetur in
            dicta quaerat magni!
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewOptionPage;
