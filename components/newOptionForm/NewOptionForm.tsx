import moment, { Moment } from "moment";
import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { useNetwork } from "wagmi";
import { TOKEN_MAP } from "../../lib/tokens";
import Button from "../button";
import DateInput from "../dateInput";
import NumberInput from "../numberInput";
import Select, { SelectOption } from "../select";

const HR = styled.hr`
  border: 0;
  border-top: 1px solid var(--gray-400);
  margin-top: 0;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 32px;

  @media (min-width: 1024px) {
    .cols-2 {
      align-items: center;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .cols-3 {
      align-items: center;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 24px;
    }
  }
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

const SubmitButton = styled(Button)`
  font-size: 24px;
  padding: 24px 32px;
`;

const NewOptionForm: FC = () => {
  const { chain } = useNetwork();

  const tokens = chain && !chain.unsupported ? TOKEN_MAP[chain.id] : [] || [];

  const tokenOptions: SelectOption[] = tokens.reduce((acc, token) => {
    return [
      ...acc,
      {
        value: token.address,
        label: `${token.symbol} (${token.name})`,
      },
    ];
  }, []);

  const getDefaultExerciseAsset = () => {
    // All networks currently use the same token list,
    // but when mainnet is available this will be more useful
    return tokenOptions.find(
      (option) => option.value === "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15"
    );
  };

  const getDefaultUnderlyingAsset = () => {
    // All networks currently use the same token list,
    // but when mainnet is available this will be more useful
    return tokenOptions.find(
      (option) => option.value === "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735"
    );
  };

  const [exerciseAsset, setExerciseAsset] = useState(getDefaultExerciseAsset());
  const [underlyingAsset, setUnderlyingAsset] = useState(
    getDefaultUnderlyingAsset()
  );

  if (tokenOptions.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <HR />
      <Section>
        <SectionHeading>Configure exercise asset</SectionHeading>
        <div className="cols-2">
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
          </FormGroup>
        </div>
      </Section>
      <Section>
        <SectionHeading>Configure underlying asset</SectionHeading>
        <div className="cols-2">
          <FormGroup>
            <Label>Underlying Asset</Label>
            <Select
              onChange={(value) => setUnderlyingAsset(value)}
              options={tokenOptions}
              value={underlyingAsset}
            />
          </FormGroup>
          <FormGroup>
            <Label>Amount in ETH</Label>
            <NumberInput innerLabel="ETH" />
          </FormGroup>
        </div>
      </Section>
      <Section>
        <SectionHeading>Contract terms</SectionHeading>
        <div className="cols-3">
          <FormGroup>
            <Label>Number of contracts</Label>
            <NumberInput innerLabel="Contracts" innerLabelPosition="right" />
          </FormGroup>
          <FormGroup data-testid="exercise-date-group">
            <Label>Exercise from date</Label>
            <DateInput
              defaultValue={moment().startOf("day").toDate()}
              isValidDate={(_currentDate) => {
                let currentDate = _currentDate as Moment;

                return currentDate.isSameOrAfter(
                  moment().startOf("day").toDate()
                );
              }}
            />
          </FormGroup>
          <FormGroup data-testid="expiry-date-group">
            <Label>Expiry date</Label>
            <DateInput defaultValue={moment().add(7, "days").toDate()} />
          </FormGroup>
        </div>
      </Section>
      <HR />
      <SubmitButton theme="purple-blue">Write New Option</SubmitButton>
    </Fragment>
  );
};

export default NewOptionForm;
