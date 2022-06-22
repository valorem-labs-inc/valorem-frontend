import styled from "styled-components";

export default styled.div`
  background: #fff;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  margin-top: 50px;
  align-self: flex-start;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  position: relative;

  .fa-xmark {
    position: absolute;
    top: 25px;
    right: 25px;
    color: var(--gray-500);
    font-size: 32px;
    cursor: pointer;
  }

  .fa-xmark:hover {
    color: var(--purple-blue);
  }

  .option-row {
    display: flex;
  }

  .option-row .option-datapoint {
    width: 100%;
  }

  .option-row:not(:last-child) {
    margin-bottom: 25px;
  }

  .option-row h5 {
    font-size: 16px;
    margin-bottom: 10px;
    color: var(--gray-600);
    text-shadow: 0px 1px 1px var(--white);
  }

  .option-row h4 {
    font-size: 20px;
    color: var(--purple-blue);
    text-shadow: 0px 1px 1px var(--white);
  }

  .option-row h4 span {
    color: var(--gray-500);
  }

  footer {
    border-top: 1px solid var(--gray-300);
    padding-top: 40px;
    margin-top: 40px;
  }

  button {
    display: block;
    width: 100%;
    padding: 15px 20px;
  }

  .button-group {
    display: flex;
    gap: 20px;
  }

  .approve {
    margin-bottom: 20px;
  }

  .warning {
    padding: 20px;
    background: var(--gray-300);
    border-radius: 5px;
    margin: 0px 0px 20px;
  }

  .warning .top {
    display: flex;
    align-items: center;
  }

  .warning .top i {
    color: var(--red);
    font-size: 28px;
    margin-right: 20px;
  }

  .warning .top p strong {
    color: var(--gray-700);
  }

  .warning .top p {
    color: var(--gray-600);
    font-size: 15px;
    line-height: 22px;
  }

  .warning .bottom {
    margin-top: 20px;
  }

  @media screen and (min-width: 768px) {
    margin-top: 100px;
    padding: 40px;

    .option-row h4 {
      font-size: 24px;
    }
  }
`;

type ModalBackdropProps = {
  open: boolean;
};

export const ModalBackdrop = styled.div`
  position: fixed;
  display: ${(props: ModalBackdropProps) => (props.open ? "flex" : "none")};
  justify-content: center;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background: rgba(62, 93, 199, 0.7);
  z-index: 99;
  padding: 0px 20px;

  .modal {
    display: ${(props: ModalBackdropProps) =>
      props.open ? "block" : "none"} !important;
  }
`;
