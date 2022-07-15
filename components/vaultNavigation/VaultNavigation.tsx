import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import styled from "styled-components";
import { CreateIcon, ViewIcon } from "./icons";

const ItemWrapper = styled.div<{ selected: boolean }>`
  align-items: center;
  background-color: ${(props) =>
    props.selected ? "var(--gray-200)" : "transparent"};
  border-radius: 6px;
  display: flex;
  font-size: 14px;
  gap: 12px;
  margin-bottom: 16px;
  transition: background-color 100ms ease-in-out;

  &:hover {
    background-color: var(--gray-200);
  }

  a {
    display: flex;
    text-decoration: none;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    width: 100%;
  }

  .label {
    color: #111f2e;
    margin-bottom: 4px;
  }

  .text {
    color: var(--gray-500);
  }

  svg {
    height: 38px;
    width: 38px;
  }
`;

interface ItemProps {
  icon: () => JSX.Element;
  label: string;
  selected?: boolean;
  text: string;
  url: string;
}

const Item: FC<ItemProps> = ({ label, text, icon, selected, url }) => {
  return (
    <ItemWrapper selected={selected}>
      <Link href={url}>
        <a>
          {icon()}
          <div>
            <p className="label">{label}</p>
            <p className="text">{text}</p>
          </div>
        </a>
      </Link>
    </ItemWrapper>
  );
};

const VaultNavigation: FC = () => {
  const router = useRouter();

  return (
    <div>
      <Item
        url="/vault"
        icon={ViewIcon}
        label="Browse contracts"
        selected={router.route === "/vault"}
        text="View options and claims"
      />
      <Item
        url="/vault/options/new"
        icon={CreateIcon}
        label="Write new option"
        selected={router.route === "/vault/options/new"}
        text="Create new options contract"
      />
    </div>
  );
};

export default VaultNavigation;
