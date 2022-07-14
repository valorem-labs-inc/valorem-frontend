import styled from "styled-components";

export const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

export const Button = styled.button`
  align-items: center;
  background-color: var(--gray-200);
  border-radius: 8px;
  display: inline-flex;
  color: var(--purple-blue);
  border: none;
  font-size: 36px;
  gap: 10px;
  letter-spacing: -0.01em;
  padding: 0 12px 8px;

  svg {
    height: 10px;
    margin-top: 8px;
  }

  cursor: pointer;
`;

export const Menu = styled.ul`
  background-color: #fff;
  box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.1),
    0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 100%;
  z-index: 9999;

  li {
    font-size: 28px;
    padding: 12px;
  }

  li:hover {
    background-color: var(--gray-200);
    cursor: pointer;
  }
`;
