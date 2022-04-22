import { FC, MouseEventHandler, ReactNode } from "react";
import styled from "@emotion/styled";
import { primary, textPrimary } from "../../variables";

const StyledButton = styled.button`
  padding: 1rem;
  border: none;
  background-color: ${(props: Props) => {
    return props.variant === "filled" ? primary : "transparent";
  }};
  color: ${textPrimary};
  width: ${(props: Props) => props.width};
  cursor: pointer;
  font-weight: bold;
  font-size: 1.5rem;
  &:hover {
    background-color: ${primary}99;
  }
`;

type Props = {
  width?: string;
  onClick?: MouseEventHandler;
  variant?: "filled" | "text";
  children: ReactNode;
};

const Button: FC<Props> = ({ children, variant, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
