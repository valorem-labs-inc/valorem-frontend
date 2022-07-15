/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import { useNetwork } from "wagmi";

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
  transition: background-color 100ms ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: var(--gray-300);
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

  & svg {
    display: block;
    width: 12px;
  }
`;

function getLogoUrl(chainID: number) {
  if (chainID === 4) {
    return "/rinkeby-logo.png";
  }
  return "/mainnet-logo.png";
}

const NetworkButton: FC = () => {
  const { chain } = useNetwork();

  return (
    <Link href="/" passHref>
      <Button data-testid="NetworkButton">
        <img src={getLogoUrl(chain.id)} alt={`${chain.name} logo`} />
        <span>{chain && chain.name}</span>
      </Button>
    </Link>
  );
};

export default NetworkButton;
