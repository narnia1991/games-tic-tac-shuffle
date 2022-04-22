import styled from "@emotion/styled";
import { FC, useState } from "react";
import Button from "../common/Button";
import { Container } from "../styled/Container";
import { textPrimary } from "../../variables";
import Board from "./Board";

const Banner = styled(Container)`
  width: 90vw;
  height: 10rem;
  justify-content: space-between;
`;

const Wrapper = styled(Container)`
  height: inherit;
  flex-direction: column;
  justify-content: space-between;
`;

const PlayerContainer = styled(Container)`
  height: inherit;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding: 3rem;
  justify-content: center;
`;
const TextDisplay = styled.span`
  color: ${textPrimary};
  font-size: 3rem;
`;

/*
  TODO:
  Game Board
  Score Indicator
  Turn Indicator
  End Game Button
  End Game Confirmation Modal
  Match Results Modal
*/

export type PlayerScore = {
  name: string;
  score: number;
};

const p1Name = window.location.pathname.split("/").pop()?.split("_")[0] || "";
const p2Name = window.location.pathname.split("/").pop()?.split("_")[1] || "";

export const DEFAULT_GAME_MATCH = {
  p1: {
    name: p1Name,
    score: 0,
  },
  p2: {
    name: p2Name,
    score: 0,
  },
};

const Game: FC = () => {
  const [gameMatch, setGameMatch] = useState(DEFAULT_GAME_MATCH);
  const [matchTurns, setMatchTurns] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(p1Name);

  return (
    <Container>
      <Wrapper>
        <Banner>
          <PlayerContainer>
            <TextDisplay>{p1Name}</TextDisplay>
            <TextDisplay>Score: {gameMatch.p1.score}</TextDisplay>
          </PlayerContainer>

          <PlayerContainer>
            <TextDisplay>{currentPlayer}'s Turn</TextDisplay>
          </PlayerContainer>

          <PlayerContainer>
            <TextDisplay>{p2Name}</TextDisplay>
            <TextDisplay>Score: {gameMatch.p2.score}</TextDisplay>
          </PlayerContainer>
        </Banner>

        <Board
          currentPlayer={currentPlayer}
          gameMatch={gameMatch}
          setGameMatch={setGameMatch}
          setCurrentPlayer={setCurrentPlayer}
        />

        <ButtonWrapper>
          <Button variant="filled">End Game</Button>
        </ButtonWrapper>
      </Wrapper>
    </Container>
  );
};

export default Game;
