/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import styled from "styled-components";
import { useNetwork } from "wagmi";

const Button = styled.button`
  align-items: center;
  background-color: var(--gray-200);
  border-radius: 4px;
  border: none;
  color: var(--gray-800);
  display: inline-flex;
  font-family: "Styrene A", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 16px;
  gap: 8px;
  height: 40px;
  line-height: 1.2;
  padding: 0 15px;
  transition: background-color 100ms ease-in-out;

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

const NetworkButton: FC = () => {
  const { chain } = useNetwork();

  return (
    <Button>
      <img src="/rinkeby-logo.png" alt="Rinkeby logo" />
      <span>{chain && chain.name}</span>
      <span>
        <svg
          width="13"
          height="7"
          viewBox="0 0 13 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5789 1.72305L7.3535 6.72969C7.1785 6.87734 7.01443 6.9375 6.87498 6.9375C6.73553 6.9375 6.54768 6.87682 6.42135 6.75463L1.17135 1.72305C0.908958 1.47422 0.900427 1.03398 1.15166 0.796094C1.40117 0.53291 1.8183 0.524352 2.07889 0.776442L6.87498 5.37344L11.6711 0.779688C11.9308 0.527606 12.3487 0.536164 12.5983 0.79934C12.8496 1.03398 12.8414 1.47422 12.5789 1.72305Z"
            fill="#233747"
          />
        </svg>
      </span>
    </Button>
  );
};

export default NetworkButton;
