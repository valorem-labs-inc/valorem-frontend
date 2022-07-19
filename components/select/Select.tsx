import { FC, useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid var(--cool-gray);
  color: var(--gray-800);
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  gap: 24px;
  justify-content: space-between;
  line-height: 1.2;
  padding: 16px 20px;
  width: 100%;
`;

const Menu = styled.div`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid var(--gray-300);
  box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  left: 0;
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
`;

const Option = styled.button`
  background-color: transparent;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  display: block;
  font-size: 16px;
  padding: 16px 20px;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: var(--gray-200);
    color: var(--gray-800);
  }
`;

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  onChange?: (option: SelectOption) => void;
  value: SelectOption;
}

const Select: FC<Props> = ({ onChange, options, value }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        data-testid="Select__button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span>{value.label}</span>
        <svg
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1433_6261)">
            <path
              d="M3.5 4.70002L7 1.20002L10.5 4.70002"
              stroke="#233747"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 10.3L7 13.8L10.5 10.3"
              stroke="#233747"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_1433_6261">
              <rect
                width="14"
                height="14"
                fill="white"
                transform="translate(0 0.5)"
              />
            </clipPath>
          </defs>
        </svg>
      </Button>
      {menuOpen && (
        <Menu data-testid="Select__menu">
          {options.map((option) => (
            <Option
              data-testid="Select__option"
              key={option.value}
              onClick={() => {
                onChange && onChange(option);
                setMenuOpen(false);
              }}
            >
              {option.label}
            </Option>
          ))}
        </Menu>
      )}
    </div>
  );
};

export default Select;
