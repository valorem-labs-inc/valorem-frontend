import styled from "styled-components";

export default styled.div`
  position: relative;

  .select-input {
    display: flex;
    position: relative;
  }

  .select-input input {
    height: 57px;
  }

  .select-input .selected-option {
    width: 100%;
    height: 57px;
    display: flex;
    align-items: center;
    border: 1px solid var(--gray-400);
    padding: 15px 20px;
    font-size: 18px;
    box-shadow: inset 0px 1px 1px 1px rgba(0, 0, 0, 0.02);
    border-radius: 3px;
    color: var(--gray-700);
  }

  .selected-option img {
    width: 25px;
    height: auto;
    display: block;
    margin-right: 10px;
  }

  .select-input:hover input,
  .select-input.open input {
    cursor: pointer;
    border: 1px solid var(--gray-400);
  }

  .select-input svg {
    position: absolute;
    right: 15px;
    top: 17px;
    width: 15px;
    height: auto;
    margin-left: auto;
  }

  .select-input svg path {
    fill: var(--gray-600);
  }

  .select-options {
    position: absolute;
    top: calc(100% + 10px);
    left: 0px;
    right: 0px;
    background: #fff;
    border: 1px solid var(--gray-400);
    z-index: 9999;
    border-radius: 3px;
    max-height: 300px;
    overflow-y: scroll;
  }

  .select-options ul li {
    display: flex;
    align-items: center;
    padding: 20px;
    font-size: 18px;
    color: var(--gray-500);
    cursor: pointer;
    border-top: 1px solid var(--white);
    border-bottom: 1px solid var(--white);
  }

  .select-options ul li:first-child {
    border-top: none;
  }

  .select-options ul li:last-child {
    border-bottom: none;
  }

  .select-options ul li img {
    width: 25px;
    height: auto;
    display: block;
    margin-right: 15px;
  }

  .select-options ul li:first-child {
    border-radius: 3px 3px 0px 0px;
  }

  .select-options ul li:last-child {
    border-radius: 0px 0px 3px 3px;
  }

  .select-options ul li:hover {
    background: var(--gray-200);
    color: var(--gray-700);
    border-top: 1px solid var(--gray-300);
    border-bottom: 1px solid var(--gray-300);
  }

  .select-options ul li:first-child:hover {
    border-top: none;
  }

  .select-options ul li:last-child:hover {
    border-bottom: none;
  }
`;
