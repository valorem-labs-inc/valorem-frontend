import { FC, useState } from "react";
import { Wrapper, Button, Menu } from "./elements";

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
      <Button
        data-testid="VaultFilter__button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
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
        <Menu data-testid="VaultFilter__menu">
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
