import moment from "moment";
import { FC } from "react";
import styled from "styled-components";
import getToken from "../../lib/getToken";
import { OptionDetails } from "../../lib/types";

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-300);
  padding: 32px;
`;

const Heading = styled.p`
  font-size: 32px;
  line-height: 1.2;
  color: var(--black);
  font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  letter-spacing: -0.06em;
  margin-bottom: 12px;

  span {
    color: var(--gray-500);
  }
`;

const SubHeading = styled.div`
  align-items: center;
  display: flex;
  gap: 4px;
  margin-bottom: 24px;

  .dollar-change {
    font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.06em;
    color: #3ec796;
  }

  .percent-change {
    color: var(--gray-800);
    font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    font-size: 16px;
    line-height: 1;
    letter-spacing: -0.06em;
  }
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  .label {
    color: var(--gray-500);
    font-size: 14px;
    line-height: 1.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  .value {
    color: var(--black);
    font-size: 24px;
    font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    line-height: 1.2;
    letter-spacing: -0.06em;
  }
`;

interface Props {
  details: OptionDetails;
}

const PositionCard: FC<Props> = ({ details }) => {
  const exerciseAsset = getToken(details.option.exerciseAsset);
  const underlyingAsset = getToken(details.option.underlyingAsset);

  const exerciseDate = moment
    .unix(details.option.exerciseTimestamp)
    .format("MM/DD/YYYY");

  const expiryDate = moment
    .unix(details.option.expiryTimestamp)
    .format("MM/DD/YYYY");

  return (
    <Card>
      <Heading>
        {underlyingAsset.symbol} / {exerciseAsset.symbol} <span>-</span>
      </Heading>
      <SubHeading>
        <p className="dollar-change">-</p>
        <p className="percent-change">(-)</p>
      </SubHeading>
      <Table>
        <div className="cell">
          <p className="label">Strike Price</p>
          <p className="value">-</p>
        </div>
        <div className="cell">
          <p className="label">Value</p>
          <p className="value">-</p>
        </div>
        <div className="cell">
          <p className="label">Exercise Date</p>
          <p className="value">{exerciseDate}</p>
        </div>
        <div className="cell">
          <p className="label">Expiry Date</p>
          <p className="value">{expiryDate}</p>
        </div>
      </Table>
    </Card>
  );
};

export default PositionCard;
