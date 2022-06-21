import StyledButton from "./index.css";

function Button({ children, ...props }): JSX.Element {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
