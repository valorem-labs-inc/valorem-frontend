import styled from "styled-components";

const getTheme = (theme = "purple-blue", target = "background") => {
  const matchingTheme = {
    "muted-purple": {
      background: `var(--muted-purple)`,
      color: `var(--white)`,
    },
    "cool-gray": {
      background: `var(--cool-gray)`,
      color: `var(--black)`,
    },
    "purple-blue": {
      background: `var(--purple-blue)`,
      color: `var(--white)`,
    },
    "dark-purple": {
      background: `var(--dark-purple)`,
      color: `var(--white)`,
    },
  }[theme];

  return (matchingTheme && matchingTheme[target]) || `#fff`;
};

export default styled.button`
  border: none;
  padding: 10px 16px;
  border-radius: 0.7rem;
  font-size: 1rem;
  font-family: "Neue Montreal";
  --webkit-font-smoothing: antialiased;
  cursor: pointer;
  width: auto;

  ${(props) => {
    return `
      background: ${getTheme(props?.theme, "background")};
      color: ${getTheme(props?.theme, "color")};
    `;
  }}

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
    background: var(--gray-500);
  }

  &:active {
    position: relative;
    top: 1px;
  }
`;
