import styled from "styled-components";
import Button from "../button";

export const HR = styled.hr`
  border: 0;
  border-top: 1px solid var(--gray-400);
  margin-top: 0;
  margin-bottom: 32px;
`;

export const Section = styled.section`
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

export const SectionHeading = styled.h2`
  font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -0.06em;
  color: var(--black);
  margin-bottom: 24px;
`;

export const Label = styled.label`
  text-transform: uppercase;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.05em;
  color: var(--gray-500);
  margin-bottom: 4px;
  display: block;
`;

export const FormGroup = styled.fieldset`
  margin-bottom: 18px;
`;

export const SubmitButton = styled(Button)`
  font-size: 24px;
  padding: 24px 32px;
`;
