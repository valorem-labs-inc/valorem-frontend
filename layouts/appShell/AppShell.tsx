import { FC } from "react";
import styled from "styled-components";
import NavBar from "../../components/navbar";

function getYear() {
  const currentYear = new Date().getFullYear();

  if (currentYear > 2022) {
    return `2022-${currentYear}`;
  }

  return currentYear;
}

const Wrapper = styled.div`
  /* background-color: red; */
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
  }

  footer {
    color: var(--gray-500);
    margin: 0 auto;
    text-align: center;
    padding: 48px;
  }
`;

const AppShell: FC = ({ children }) => {
  return (
    <Wrapper>
      <NavBar />
      <div className="content">{children}</div>
      <footer>
        <p>&copy; {getYear()}, Valorem Labs Inc. All rights reserved.</p>
      </footer>
    </Wrapper>
  );
};

export default AppShell;
