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

  .tabs ul {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--gray-400);
  }

  .tabs ul li {
    padding: 15px 20px;
    border-radius: 3px 3px 0px 0px;
    border: 1px solid transparent;
    margin-bottom: -1px;
  }

  .tabs ul li:hover {
    cursor: pointer;
  }

  .tabs ul li.active {
    padding: 15px 20px;
    border-radius: 3px 3px 0px 0px;
    border: 1px solid var(--gray-400);
    position: relative;
    border-bottom: 1px solid var(--white);
  }

  .tabs ul li.active:before {
    content: "";
    display: block;
    position: absolute;
    left: -1px;
    top: -1px;
    right: -1px;
    height: 3px;
    border-radius: 3px 3px 0px 0px;
    background: var(--purple-blue);
  }

  .options ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }

  .options ul li {
    background: #fff;
    padding: 30px;
    border-radius: 3px;
    border: 1px solid var(--gray-400);
    position: relative;
  }

  .options ul li.expired {
    position: relative;
    overflow: hidden;
  }

  .options ul li.expired > * {
    opacity: 0.5;
  }

  .options ul li.expired:before {
    content: "Expired";
    display: block;
    position: absolute;
    top: 7px;
    right: -55px;
    background: var(--purple-blue);
    color: #fff;
    padding: 10px 20px;
    transform: rotate(29deg);
    width: 193px;
    text-align: center;
  }

  .options ul li.expired:hover {
    transform: scale(1, 1) !important;
    box-shadow: none;
    border: 1px solid var(--gray-400) !important;
  }

  .options ul li.expired:hover button {
    background: var(--gray-400);
    color: var(--gray-700);
  }

  .options ul li > a {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    text-indent: -9999px;
  }

  .options ul li:hover {
    transform: scale(1.01, 1.01);
    box-shadow: var(--box-shadow-light);
    border: 1px solid var(--purple-blue);
    z-index: 10;
    cursor: pointer;
  }

  .options ul li .option-row {
    display: flex;
  }

  .options ul li .option-row .option-datapoint {
    width: 100%;
  }

  .options ul li .option-row:not(:last-child) {
    margin-bottom: 25px;
  }

  .options ul li .option-row h5 {
    font-size: 16px;
    margin-bottom: 10px;
    color: var(--gray-600);
    text-shadow: 0px 1px 1px var(--white);
  }

  .options ul li .option-row h4 {
    font-size: 20px;
    color: var(--purple-blue);
    text-shadow: 0px 1px 1px var(--white);
  }

  .options ul li .option-row h4 span {
    color: var(--gray-500);
  }

  .options ul li button {
    margin-top: 30px;
    display: block;
    width: 100%;
    background: var(--gray-400);
    color: var(--gray-700);
  }

  .options ul li:hover button {
    background: var(--purple-blue);
    color: var(--white);
  }

  @media screen and (min-width: 992px) {
    header h4 {
      font-size: 24px;
    }
  }

  @media screen and (min-width: 1290px) {
    .options ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (min-width: 1450px) {
    .options ul li .option-row h4 {
      font-size: 22px;
    }
  }
`;
