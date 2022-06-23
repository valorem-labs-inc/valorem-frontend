import { FC } from "react";
import { BigNumber } from "ethers";
import moment from "moment";
import { smartFormatCurrency } from "../../lib/currencyFormat";
import getToken from "../../lib/getToken";
import { OptionDetails } from "../../lib/types";
import Button from "../button";

const formatDate = (detail: OptionDetails, field: string): string => {
  const fieldName = `${field}Timestamp`;
  return moment.unix(detail.option[fieldName]).format("MMM Do, YYYY");
};

const formatAmount = (detail: OptionDetails, field: string): string => {
  const amountField = `${field}Amount`;
  const assetField = `${field}Asset`;
  const token = getToken(detail.option[assetField]).symbol;
  const amount: BigNumber = detail.option[amountField];
  const showAmount = amount.gt(0)
    ? smartFormatCurrency(amount, detail[assetField])
    : "~";
  return `${showAmount} ${token}`;
};

interface Props {
  expired?: boolean;
  options: OptionDetails[];
  onSelect: (optionDetail: OptionDetails) => void;
}

const OptionsList: FC<Props> = ({ expired, options, onSelect }) => {
  return (
    <div className="options">
      <ul>
        {options.map((optionDetail) => {
          return (
            <li
              key={`item-${optionDetail?.option.id}`}
              className={`option ${expired ? "expired" : ""}`}
              onClick={() => onSelect(optionDetail)}
            >
              <div className="option-row">
                <div className="option-datapoint">
                  <h5>Balance</h5>
                  <h4>{optionDetail?.balance?.toNumber().toString() || 0}</h4>
                </div>
              </div>
              <div className="option-row">
                <div className="option-datapoint">
                  <h5>Exercise Date</h5>
                  <h4>{formatDate(optionDetail, "exercise")}</h4>
                </div>
                <div className="option-datapoint">
                  <h5>Expiry Date</h5>
                  <h4>{formatDate(optionDetail, "expiry")}</h4>
                </div>
              </div>
              <div className="option-row">
                <div className="option-datapoint">
                  <h5>Underlying Asset Amount</h5>
                  <h4>
                    {formatAmount(optionDetail, "underlying")}{" "}
                    <span>(x {optionDetail?.balance.toNumber() || 0})</span>
                  </h4>
                </div>
                <div className="option-datapoint">
                  <h5>Exercise Asset Amount</h5>
                  <h4>
                    {formatAmount(optionDetail, "exercise")}{" "}
                    <span>(x {optionDetail?.balance.toNumber() || 0})</span>
                  </h4>
                </div>
              </div>
              <Button
                theme="purple-blue"
                onClick={() => onSelect(optionDetail)}
              >
                View Option
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OptionsList;
