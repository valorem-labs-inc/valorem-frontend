/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatAddress } from "../../lib/utilities";

const Button = styled.a`
  align-items: center;
  background-color: var(--gray-200);
  border-radius: 4px;
  border: none;
  color: var(--gray-800);
  cursor: pointer;
  display: inline-flex;
  font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 16px;
  gap: 8px;
  height: 40px;
  line-height: 1.2;
  padding: 0 15px;
  text-decoration: none;
  transition: background-color 100ms ease-in-out;

  &:hover {
    background-color: var(--gray-300);
  }

  & .address {
    display: none;
  }

  & .status-container {
    position: relative;

    &::before {
      background-color: #3ec796;
      border-radius: 99999px;
      bottom: -3px;
      content: "";
      height: 6px;
      position: absolute;
      right: -3px;
      width: 6px;
    }
  }

  & img {
    display: block;
    height: 18px;
  }

  @media (min-width: 640px) {
    .address {
      display: inline;
    }
  }
`;

const WalletButton: FC = () => {
  const { address, connector } = useAccount();

  if (!connector) {
    return null;
  }

  return (
    <Link href="/" passHref>
      <Button data-testid="WalletButton">
        <div className="status-container">
          <img
            src={`/${connector.name.toLowerCase()}.svg`}
            alt={`${connector.name} logo`}
          />
        </div>
        <span className="address">{formatAddress(address)}</span>
      </Button>
    </Link>
  );
};

export default WalletButton;
