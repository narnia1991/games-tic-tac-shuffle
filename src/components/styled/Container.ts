import styled from "@emotion/styled";
import { bgColor, fallBackFont, textPrimary } from "../../variables";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${bgColor};
  margin: 0;
  color: ${textPrimary};
  font-family: ${fallBackFont};
  font-size: 1.2rem;
`;
