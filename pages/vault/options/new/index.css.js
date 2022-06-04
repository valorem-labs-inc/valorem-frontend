import styled from "styled-components";

export default styled.div`
  > header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--gray-300);
    height: 60px;
  }

  > header h4 {
    font-size: 20px;
  }

  .asset {
    border: 1px solid var(--gray-400);
    padding: 20px;
    border-radius: 3px;
  }

  .asset:not(:last-child) {
    margin-bottom: 20px;
  }

  .asset > header {
    margin: -20px -20px 20px -20px;
    border-bottom: 1px solid var(--gray-400);
    padding: 20px;
    border-radius: 3px 3px 0px 0px;
    background: var(--gray-200);
  }

  .asset > header h4 {
    font-size: 18px;
    color: var(--gray-700);
  }

  form > button {
    width: 100%;
    display: block;
    padding: 20px 40px;
    font-size: 20px;
  }

  .write-warning {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    font-size: 15px;
    line-height: 23px;
    border-radius: 5px;
    background: #c73e7a;
    color: #fff;
    text-align: center;
  }

  @media screen and (min-width: 992px) {
    > header h4 {
      font-size: 24px;
    }
  }
`;
