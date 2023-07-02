import { FC, MouseEventHandler } from "react";
import styled from "@emotion/styled";

const CContainer = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    input ~ span {
      background-color: #ccc;
    }
  }
`;

const Radio = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  &:checked {
    ~ span {
      background-color: #2196f3;
      &:after {
        display: block;
      }
    }
  }
`;

const InnerRadio = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  &:after {
    content: "";
    position: absolute;
    display: none;
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 2%;
  }
`;

type Props = {
  label?: string;
  onClick?: MouseEventHandler;
  name: string;
  value: string;
  checked: boolean;
};

const Checkbox: FC<Props> = ({
  checked,
  label,
  name,
  onClick,
  value,
  ...props
}) => {
  return (
    <CContainer onClick={onClick}>
      {label}
      <Radio
        name={name.toString()}
        type="radio"
        {...props}
        defaultChecked={checked}
      ></Radio>
      <InnerRadio className="checkmark"></InnerRadio>
    </CContainer>
  );
};

export default Checkbox;
