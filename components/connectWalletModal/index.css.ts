import styled from "styled-components";

export default styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: relative;

  .overlay {
    background: rgba(107, 114, 128, 0.7);
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 0;
  }

  .modal-layer {
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 10;
  }

  .modal-position {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 100%;
  }

  .modal {
    background-color: #fff;
    border-radius: 10px;
    max-width: 720px;
    width: 100%;
    overflow: hidden;
  }

  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .option {
    border: 1px solid #f3f4f6;
    padding: 40px;
    text-align: center;
    transition: background-color ease-in-out 50ms;
  }

  .option:hover {
    background-color: var(--gray-200);
    cursor: pointer;
  }

  .option__logo {
    height: 64px;
    margin-bottom: 16px;
  }

  .option__name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .option__text {
    color: var(--gray-600);
  }
`;
