import { FC, useState } from "react";
import styled from "styled-components";
import DateTime from "react-datetime";
import moment from "moment";

const Wrapper = styled.div`
  .input {
    border: 1px solid var(--cool-gray);
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    color: var(--gray-800);
    font-size: 16px;
    padding: 16px 20px;
    width: 100%;
  }
`;

interface Props {
  defaultValue?: Date;
  isValidDate?: (currentDate: any, selectedDate: any) => boolean;
}

const DateInput: FC<Props> = ({ defaultValue, isValidDate }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <Wrapper>
      <DateTime
        dateFormat="dddd, MMMM D YYYY"
        inputProps={{
          className: "input",
        }}
        isValidDate={(currentDate, selectedDate) => {
          if (isValidDate) {
            return isValidDate(currentDate, selectedDate);
          }
          return true;
        }}
        renderDay={(props, currentDate) => {
          return (
            <td
              {...props}
              data-testid={`td-${currentDate.month()}-${currentDate.date()}`}
            >
              {currentDate.date()}
            </td>
          );
        }}
        renderInput={(props) => {
          return <input {...props} />;
        }}
        onChange={(value) => {
          if (typeof value === "string") {
            return;
          }

          setValue(value.toDate());
        }}
        value={value}
        timeFormat={false}
      />
    </Wrapper>
  );
};

DateInput.defaultProps = {
  defaultValue: new Date(),
};

export default DateInput;
