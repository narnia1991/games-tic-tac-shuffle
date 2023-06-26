import styled from "@emotion/styled";
import { FC, RefObject } from "react";

const StyledInput = styled.input`
  padding: 1rem;
  width: 100%;
`;

type Props = {
  name: string;
  forwardRef: RefObject<HTMLInputElement>;
  type?: string;
};

const Input: FC<Props> = ({ name, forwardRef, ...props }) => {
  return (
    <StyledInput
      type="text"
      ref={forwardRef}
      name={name}
      {...props}
    ></StyledInput>
  );
};

export default Input;
