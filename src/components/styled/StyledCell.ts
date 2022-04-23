import styled from "@emotion/styled";
import { textPrimary } from "../../variables";

export const StyledCell = styled.div`
  width: var(--cell-size);
  height: var(--cell-size);
  border: 3px solid ${textPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  &:first-of-type,
  &:nth-of-type(2),
  &:nth-of-type(3) {
    border-top: none;
  }
  &:nth-of-type(3n + 1) {
    border-left: none;
  }
  &:nth-of-type(3n + 3) {
    border-right: none;
  }
  &:last-of-type,
  &:nth-of-type(8),
  &:nth-of-type(7) {
    border-bottom: none;
  }
  &.cross,
  &.circle {
    cursor: not-allowed;
  }
  &.cross::before,
  &.cross::after,
  &.circle::before {
    background-color: ${textPrimary};
  }
`;
