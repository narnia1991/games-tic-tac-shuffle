import styled from "@emotion/styled";
import { FC } from "react";

const StyledInput = styled.input`
  padding: 1rem;
  width: 100%;
`;

type Props = {
  name: string;
};

const Input: FC<Props> = ({ name, ...props }) => {
  return <StyledInput type="text" name={name} {...props}></StyledInput>;
};

export default Input;
