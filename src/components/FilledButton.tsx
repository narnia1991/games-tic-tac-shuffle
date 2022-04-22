import { FC, ReactNode } from "react";
import styled from "@emotion/styled";
import { primary, secondary, textPrimary } from "../colors";

type Props = {
  width?: string;
  onClick?(): void;
  children: ReactNode;
};

const Button = styled.button`
  padding: 1rem;
  background-color: ${primary};
  color: ${textPrimary};
  width: ${(props: Props) => props.width};
  cursor: pointer;
  &:hover {
    background-color: ${primary}99;
  }
`;

const FilledButton: FC<Props> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default FilledButton;
