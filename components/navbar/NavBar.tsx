/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import React, { FC } from "react";
import styled from "styled-components";

const Actions = dynamic(() => import("./NavBarActions"), {
  ssr: false,
});

const Wrapper = styled.nav`
  background-color: #fff;
  box-shadow: 0px 1.5px 0px #dbdbdb;

  .inner {
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 84px;
    padding: 0 16px;
    margin: 0 auto;
    max-width: 1224px;
  }

  .logo {
    display: none;
    height: 36px;
  }

  .mobile-logo {
    color: var(--purple-blue);
    height: 36px;
    width: 36px;

    svg {
      height: 100%;
      width: 100%;
    }
  }

  @media (min-width: 540px) {
    .logo {
      display: block;
    }

    .mobile-logo {
      display: none;
    }
  }
`;

const NavBar: FC = () => {
  return (
    <Wrapper>
      <div className="inner">
        <img className="logo" alt="Valorem logo" src="/logo.png" />
        <div className="mobile-logo">
          <svg
            width="70"
            height="58"
            viewBox="0 0 70 58"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M69.3577 14.5031H29.7265L39.6312 0H0L19.8156 29L29.7265 14.5031L39.6312 29H19.8156H0L19.8156 58L39.6312 29L49.5421 43.5031L69.3577 14.5031Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <Actions />
      </div>
    </Wrapper>
  );
};

export default NavBar;
