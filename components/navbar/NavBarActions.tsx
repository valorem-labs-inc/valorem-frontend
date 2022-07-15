import { useRouter } from "next/router";
import React, { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import MobileMenu from "../mobileMenu";
import NetworkButton from "../networkButton";
import WalletButton from "../walletButton";

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`;

const DisconnectButton = styled.button`
  background-color: transparent;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  height: 40px;
  padding: 0 8px;
  transition: background-color 100ms ease-in-out;
  display: none;

  &:hover {
    background-color: var(--gray-200);
  }

  @media (min-width: 640px) {
    & {
      display: inline-block;
    }
  }
`;

const MenuButton = styled.button`
  background-color: transparent;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  height: 40px;
  padding: 0 8px;
  transition: background-color 100ms ease-in-out;

  &:hover {
    background-color: var(--gray-200);
  }

  @media (min-width: 640px) {
    & {
      display: none;
    }
  }
`;

const NavBarActions: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect({
    onMutate: async () => {
      await router.push("/");
    },
  });

  if (!isConnected || router.route === "/") {
    return null;
  }

  return (
    <Fragment>
      <Wrapper>
        <NetworkButton />
        <WalletButton />
        <DisconnectButton onClick={() => disconnect()}>
          <svg
            width="24"
            height="21"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 20.375C9 20.9984 8.49844 21.5 7.875 21.5H4.5C2.01469 21.5 0 19.4853 0 17V5C0 2.51469 2.01469 0.5 4.5 0.5H7.875C8.49844 0.5 9 1.00344 9 1.625C9 2.24609 8.49844 2.75 7.875 2.75H4.5C3.2625 2.75 2.25 3.7625 2.25 5V17C2.25 18.2375 3.2625 19.25 4.5 19.25H7.875C8.49844 19.25 9 19.7516 9 20.375ZM23.6953 10.2313L17.7375 3.85625C17.3112 3.40212 16.5994 3.38188 16.148 3.80792C15.6953 4.2327 15.6736 4.94464 16.0996 5.39745L20.2687 9.875H8.58281C8.00156 9.875 7.5 10.3813 7.5 11C7.5 11.6187 8.00391 12.125 8.58281 12.125H20.2266L16.0116 16.6044C15.5853 17.057 15.6073 17.7687 16.0599 18.1939C16.3219 18.3969 16.5984 18.5 16.8328 18.5C17.1316 18.5 17.4305 18.3814 17.6517 18.1455L23.6095 11.7705C24.1031 11.3375 24.1031 10.6625 23.6953 10.2313Z"
              fill="#95A3AD"
            />
          </svg>
        </DisconnectButton>
        <MenuButton onClick={() => setMenuOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="#95A3AD"
          >
            <path
              fill="#95A3AD"
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </MenuButton>
      </Wrapper>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </Fragment>
  );
};

export default NavBarActions;
