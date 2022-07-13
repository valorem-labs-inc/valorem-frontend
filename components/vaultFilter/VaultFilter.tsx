import { FC, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const Button = styled.button`
  align-items: center;
  background-color: var(--gray-200);
  border-radius: 8px;
  display: inline-flex;
  color: var(--purple-blue);
  border: none;
  font-size: 36px;
  gap: 10px;
  letter-spacing: -0.01em;
  padding: 0 12px 8px;
  margin-bottom: 12px;

  svg {
    height: 10px;
    margin-top: 8px;
  }

  cursor: pointer;
`;

const Menu = styled.ul`
  background-color: #fff;
  box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 100%;
  z-index: 9999;

  li {
    font-size: 28px;
    padding: 12px;
  }

  li:hover {
    background-color: var(--gray-200);
    cursor: pointer;
  }
`;

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  filters: FilterOption[];
  onChange?: (filter: FilterOption) => void;
  value: FilterOption;
}

const VaultFilter: FC<Props> = ({ filters, onChange, value }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Wrapper>
      <Button onClick={() => setMenuOpen(!menuOpen)}>
        <span>{value.label}</span>
        <svg
          width="21"
          height="12"
          viewBox="0 0 21 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.2781 2.81094L11.3203 11.3938C11.0203 11.6469 10.739 11.75 10.5 11.75C10.2609 11.75 9.93887 11.646 9.72231 11.4365L0.722312 2.81094C0.272499 2.38438 0.257874 1.62969 0.688562 1.22188C1.1163 0.770703 1.83137 0.756032 2.27809 1.18819L10.5 9.06875L18.7218 1.19375C19.1672 0.76161 19.8834 0.776282 20.3114 1.22744C20.7422 1.62969 20.7281 2.38438 20.2781 2.81094Z"
            fill="#95A3AD"
          />
        </svg>
      </Button>
      {menuOpen && (
        <Menu>
          {filters.map((filter) => (
            <li
              key={filter.value}
              onClick={() => {
                onChange && onChange(filter);
                setMenuOpen(false);
              }}
            >
              {filter.label}
            </li>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default VaultFilter;
