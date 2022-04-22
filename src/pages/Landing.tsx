import styled from "@emotion/styled";
import { FC } from "react";
import FilledButton from "../components/FilledButton";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* TODO: 
    Start game button
    Mode selector
    Start game modal
    Leaderboards
*/

const Landing: FC = () => {
  return (
    <Container>
      <FilledButton width="10rem">START GAME</FilledButton>
    </Container>
  );
};

export default Landing;
