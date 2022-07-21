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
import NumberInput from "../../../../components/numberInput";
import DateInput from "../../../../components/dateInput";
import NewOptionForm from "../../../../components/newOptionForm";

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

const Title = styled.h1`
  color: var(--purple-blue);
  font-size: 48px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
`;

const Description = styled.p`
  color: var(--gray-500);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const HR = styled.hr`
  border: 0;
  border-top: 1px solid var(--gray-400);
  margin-top: 0;
  margin-bottom: 32px;
`;

const SectionHeading = styled.h2`
  font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: var(--black);
  margin-bottom: 24px;
`;

const Label = styled.label`
  text-transform: uppercase;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.05em;
  color: var(--gray-500);
  margin-bottom: 4px;
  display: block;
`;

const FormGroup = styled.fieldset`
  margin-bottom: 18px;
`;

const NewOptionPage: NextPage = () => {
  const { chain } = useNetwork();

  const tokens = chain && !chain.unsupported ? TOKEN_MAP[chain.id] : [];

  const tokenOptions = tokens.reduce((acc, token) => {
    return [
      ...acc,
      {
        value: token.address,
        label: `${token.symbol} (${token.name})`,
      },
    ];
  }, []);

  const [exerciseAsset, setExerciseAsset] = useState(tokenOptions[0]);

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
        <Title>Write new option</Title>
        <Description>
          Valorem will charge a 0.05% fee in order to exercise this option.
        </Description>
        <NewOptionForm />
        {/* <HR />
        <SectionHeading>Configure exercise asset</SectionHeading>
        <FormGroup>
          <Label>Exercise Asset</Label>
          <Select
            onChange={(value) => setExerciseAsset(value)}
            options={tokenOptions}
            value={exerciseAsset}
          />
        </FormGroup>
        <FormGroup>
          <Label>Amount in ETH</Label>
          <NumberInput innerLabel="ETH" />
        </FormGroup> */}
      </div>
    </Wrapper>
  );
};

export default NewOptionPage;
