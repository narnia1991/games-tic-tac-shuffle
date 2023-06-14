import styled from "@emotion/styled";
import { textPrimary } from "../../variables";
import { Container } from "./Container";

export const Banner = styled(Container)`
  height: 10rem;
  justify-content: space-between;
  display: flex;
`;

export const Wrapper = styled(Container)`
  height: inherit;
  flex-direction: column;
  justify-content: space-between;
`;

export const PlayerContainer = styled(Container)`
  height: inherit;
  font-size: 2rem;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
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
