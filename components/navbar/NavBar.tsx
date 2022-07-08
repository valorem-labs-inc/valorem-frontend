/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import styled from "styled-components";

const Wrapper = styled.nav`
  background-color: #fff;
  box-shadow: 0px 1.5px 0px #dbdbdb;

  .inner {
    align-items: center;
    display: flex;
    height: 84px;
    padding: 0 16px;
    margin: 0 auto;
    max-width: 1224px;
  }

  .logo {
    height: 36px;
  }
`;

const NavBar: FC = () => {
  return (
    <Wrapper>
      <div className="inner">
        <img className="logo" alt="Valorem logo" src="/logo.png" />
      </div>
    </Wrapper>
  );
};

export default NavBar;
