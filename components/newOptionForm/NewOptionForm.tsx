import { FC, Fragment, useState } from "react";
import moment, { Moment } from "moment";
import { useNetwork } from "wagmi";
import { TOKEN_MAP } from "../../lib/tokens";
import DateInput from "../dateInput";
import NumberInput from "../numberInput";
import Select, { SelectOption } from "../select";
import {
  HR,
  Section,
  SectionHeading,
  FormGroup,
  Label,
  SubmitButton,
} from "./elements";

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
