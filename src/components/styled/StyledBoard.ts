import styled from "@emotion/styled";
import { bgColor } from "../../variables";
export const StyledBoard = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  color: transparent;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, auto);
  &.disabled {
    cursor: not-allowed;
  }
  &.cross div:not(.cross):not(.circle):hover::before,
  &.cross div:not(.cross):not(.circle):hover::after,
  &.circle div:not(.cross):not(.circle):hover::before {
    background-color: lightgrey;
  }

  div.cross::before,
  div.cross::after,
  &.cross div:not(.cross):not(.circle):hover::before,
  &.cross div:not(.cross):not(.circle):hover::after {
    content: "";
    position: absolute;
    width: calc(var(--mark-size) * 0.15);
    height: var(--mark-size);
  }

  div.cross::before,
  &.cross div:not(.cross):not(.circle):hover::before {
    transform: rotate(45deg);
  }

  div.cross::after,
  &.cross div:not(.cross):not(.circle):hover::after {
    transform: rotate(-45deg);
  }

  div.circle::before,
  div.circle::after,
  &.circle div:not(.cross):not(.circle):hover::before,
  &.circle div:not(.cross):not(.circle):hover::after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }

  div.circle::before,
  &.circle div:not(.cross):not(.circle):hover::before {
    width: var(--mark-size);
    height: var(--mark-size);
  }

  div.circle::after,
  &.circle div:not(.cross):not(.circle):hover::after {
    width: calc(var(--mark-size) * 0.7);
    height: calc(var(--mark-size) * 0.7);
    background-color: ${bgColor};
  }
`;
