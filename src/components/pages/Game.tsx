import { Dispatch, FC, useEffect } from "react";
import Button from "../common/Button";
import { Container } from "../styled/Container";
import Board from "./Board";
import {
  Banner,
  ButtonWrapper,
  PlayerContainer,
  TextDisplay,
  Wrapper,
} from "../styled/StyledGame";
import { useGame } from "../provider/GameProvider";
import { GameAction, GameState } from "../types/types";

/*
  TODO:
  Game Board
  Score Indicator
  Turn Indicator
  End Game Button
  End Game Confirmation Modal
  Match Results Modal
*/

export const getNames = (dispatch: Dispatch<GameAction>) => {
  const p1Name = window.location.pathname.split("/").pop()?.split("_")[0] || "";
  const p2Name = window.location.pathname.split("/").pop()?.split("_")[1] || "";

  dispatch({
    type: "SET_PLAYER_NAMES",
    payload: {
      p1: p1Name,
      p2: p2Name,
    },
  });
};

const Game: FC = () => {
  const [state, dispatch] = useGame();
  const { gameMatch, currentPlayer } = state as GameState;
  const { p1, p2 } = gameMatch;

  useEffect(() => {
    getNames(dispatch as Dispatch<GameAction>);
  }, []);

  return (
    <Container>
      <Wrapper>
        <Banner>
          <PlayerContainer>
            <TextDisplay>{p1.name}</TextDisplay>
            <TextDisplay>Score: {p1.score}</TextDisplay>
          </PlayerContainer>

          <PlayerContainer>
            <TextDisplay>{gameMatch[currentPlayer].name}'s Turn</TextDisplay>
          </PlayerContainer>

          <PlayerContainer>
            <TextDisplay>{p2.name}</TextDisplay>
            <TextDisplay>Score: {p2.score}</TextDisplay>
          </PlayerContainer>
        </Banner>

        {p1.name && <Board />}

        <ButtonWrapper>
          <Button variant="filled">End Game</Button>
        </ButtonWrapper>
      </Wrapper>
    </Container>
  );
};

export default Game;
