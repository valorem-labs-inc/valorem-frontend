import styled from "styled-components";

export default styled.nav`
  background: var(--white);
  padding: 20px 20px;
  color: var(--gray-700);
  margin: -20px -20px 20px;
  border-bottom: 1px solid var(--gray-300);

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul li:before {
    content: "/";
    display: inline-block;
    color: var(--gray-600);
    margin-right: 5px;
  }

  ul li {
    margin-right: 5px;
  }

  ul li a {
    color: var(--gray-500);
    text-decoration: none;
  }

  ul li:hover a {
    color: var(--purple-blue);
  }

  ul li.active a {
    color: var(--purple-blue);
  }
`;
