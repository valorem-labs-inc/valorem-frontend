import styled from "styled-components";

export default styled.div`
  > footer {
    position: static;
    bottom: 30px;
    margin: 0 auto;
    text-align: center;
    left: 0px;
    right: 0px;
  }

  > footer p {
    color: var(--gray-500);
  }

  @media screen and (min-height: 540px) {
    > footer {
      position: fixed;
    }
  }
`;
