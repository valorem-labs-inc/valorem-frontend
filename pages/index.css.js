import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;

  .wallet-error {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 40px auto 0;
    padding: 20px;
    font-size: 15px;
    line-height: 23px;
    border-radius: 5px;
    background: #c73e7a;
    color: #fff;
    text-align: center;
  }

  &.fade-out {
    animation: fade-shrink 1s 1;
    opacity: 0;
    transform: scale(0, 0);
  }

  .logo {
    display: inline-block;
    width: 200px;
    height: auto;
    margin: 0 auto 50px;
  }

  p {
    max-width: 90%;
    margin: 50px auto;
    color: var(--gray-500);
    font-size: 16px;
    line-height: 24px;
  }

  button {
    padding: 24px 32px;
    border-radius: 1.5rem;
    font-size: 1.5rem;
    animation: connect-wallet-button 3s infinite;
    transition: transform 0.3s ease-in-out;
    transform: scale(1, 1);
  }

  button:hover {
    animation: none;
    transform: scale(1.03, 1.03);
    box-shadow: var(--box-shadow);
  }

  @media screen and (min-width: 786px) {
    padding-top: 100px;

    p {
      max-width: 80%;
    }
  }
`;
