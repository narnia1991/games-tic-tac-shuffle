import { Dispatch, FC, useEffect } from "react";
import { Container } from "../styled/Container";
import Board from "./Board";
import {
  Banner,
  PlayerContainer,
  TextDisplay,
  Wrapper,
} from "../styled/StyledGame";
import { useGame } from "../provider/GameProvider";
import { GameAction, GameState } from "../types/types";
import { ROOT_URL } from "../../App";

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
  const p1Name =
    window.location.pathname.split(`${ROOT_URL}/`).pop()?.split("_")[0] || "";
  const p2Name =
    window.location.pathname.split(`${ROOT_URL}/`).pop()?.split("_")[1] || "";

  dispatch({
    type: "SET_PLAYER_NAMES",
    payload: {
      p1: decodeURI(p1Name),
      p2: decodeURI(p2Name) || "Computer",
    },
  });
};

const Game: FC = () => {
  const [state, dispatch] = useGame();
  const { gameMatch, currentPlayer } = state as GameState;
  const { p1, p2 } = gameMatch;

  useEffect(() => {
    getNames(dispatch as Dispatch<GameAction>);
  }, [dispatch]);

  return (
    <Container>
      <Wrapper>
        <Banner>
          <PlayerContainer>
            <TextDisplay>{p1.name}</TextDisplay>
            <TextDisplay>Score: {p1.score}</TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "center" }}>
            <TextDisplay>{gameMatch[currentPlayer].name}'s Turn</TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "right" }}>
            <TextDisplay>{p2.name}</TextDisplay>
            <TextDisplay>Score: {p2.score}</TextDisplay>
          </PlayerContainer>
        </Banner>

        {p1.name && <Board />}
      </Wrapper>
    </Container>
  );
};

export default Game;
