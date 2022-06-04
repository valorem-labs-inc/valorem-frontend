import styled from "styled-components";

export default styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: var(--gray-300);
  border-radius: 5px;
  margin: 0px 0px 20px;
  text-align: ${(props) => (props.center ? "center" : "left")};

  p {
    display: flex;
    align-items: center;
    margin: 0 auto;
    align-self: center;
    color: var(--gray-700);
    font-size: 15px;
    line-height: 22px;
  }

  p strong {
    font-size: 24px;
    margin-right: 10px;
    display: inline-block;
    color: var(--gray-800);
    font-weight: bold;
  }
`;
