import styled from "styled-components";

export default styled.div`
  header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--gray-300);
    height: 60px;
  }

  header h4 {
    font-size: 20px;
  }

  header button {
    margin-left: auto;
  }

  table tbody tr td i {
    display: inline-block;
    margin-right: 5px;
    position: relative;
    top: 1px;
  }

  table tbody tr td .fa-check {
    color: var(--green);
  }

  table tbody tr td .fa-xmark {
    color: var(--red);
  }

  table tbody tr td button {
    min-width: 90px;
  }

  @media screen and (min-width: 992px) {
    header h4 {
      font-size: 24px;
    }
  }

  @media screen and (min-width: 1290px) {
    .claims ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
`;
