import styled from "styled-components";

export default styled.div`
  margin: 0 auto;
  padding: 10px;

  .vault-content {
    display: flex;
    flex-direction: column;
  }

  aside {
    margin-bottom: 20px;
  }

  aside .connected-account {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--gray-300);
  }

  aside .connected-account > div {
    display: flex;
    background: var(--white);
    padding: 20px;
    border-radius: 3px;
    box-shadow: var(--box-shadow);
  }

  aside .connected-account h5 {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--purple-blue);
    margin-bottom: 10px;
  }

  aside .connected-account p {
    font-size: 15px;
    color: var(--gray-600);
  }

  aside .connected-account button {
    margin-left: auto;
  }

  aside ul li {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--gray-300);
    padding: 15px;
    border-radius: 3px;
    transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;
  }

  aside ul li a {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    text-indent: -9999px;
  }

  aside ul li.active,
  aside ul li:hover {
    background: #fff;
    box-shadow: var(--box-shadow);
  }

  aside ul li .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    background: var(--gray-400);
    color: var(--gray-500);
    border-radius: 3px;
    font-size: 24px;
  }

  aside ul li.active .icon {
    color: #fff;
    background: var(--purple-blue);
  }

  aside ul li header {
    margin-left: 15px;
  }

  aside ul li header h4 {
    font-weight: bold;
    color: var(--gray-700);
    margin-bottom: 5px;
  }

  aside ul li header p {
    color: var(--gray-500);
    font-size: 15px;
    line-height: 21px;
  }

  aside ul li:not(:last-child) {
    margin-bottom: 20px;
  }

  main {
    background: #fff;
    border-radius: 3px;
    padding: 20px;
    position: relative;
  }

  @media screen and (min-width: 992px) {
    padding: 40px;

    .vault-content {
      flex-direction: row;
      position: relative;
    }

    aside {
      position: sticky;
      align-self: flex-start;
      top: 40px;
      width: 365px;
      min-width: 365px;
      margin-bottom: 0px;
    }

    main {
      width: 100%;
      margin-left: 40px;
    }
  }
`;
