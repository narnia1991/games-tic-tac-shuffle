import styled from "@emotion/styled";
import { textPrimary } from "../../variables";
import { Container } from "./Container";

export const Banner = styled(Container)`
  width: 90vw;
  height: 10rem;
  justify-content: space-between;
`;

export const Wrapper = styled(Container)`
  height: inherit;
  flex-direction: column;
  justify-content: space-between;
`;

export const PlayerContainer = styled(Container)`
  height: inherit;
  flex-direction: column;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  padding: 3rem;
  justify-content: center;
`;

export const TextDisplay = styled.span`
  color: ${textPrimary};
  font-size: 3rem;
`;
