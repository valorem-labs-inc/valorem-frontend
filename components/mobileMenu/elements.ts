import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999999;
`;

export const Menu = styled.div`
  background-color: #fff;
  width: 80%;
  max-width: 420px;
  height: 100vh;

  .top-area {
    align-items: center;
    display: flex;
    height: 84px;
    padding: 0 16px;
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 99999px;
  color: var(--gray-500);
  padding: 4px;

  svg {
    display: block;
    height: 32px;
    width: 32px;
  }
`;
