import { Dispatch, FC, useCallback, useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import JoinGameModal from "../modal/JoinGameModal";
import InviteModal from "../modal/InviteModal";
import Button from "../common/Button";

/*
  TODO:
  Game Board
  Score Indicator
  Turn Indicator
  End Game Button
  End Game Confirmation Modal
  Match Results Modal
*/

const Game: FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();
  const [state, dispatch] = useGame();
  const { gameMatch, currentPlayer } = state as GameState;
  const { p1, p2 } = gameMatch;

  const isJoining = location.pathname.split("/").includes("join");

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleInviteClick = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const onInviteModalClose = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isJoining) {
      const sessionId = location.pathname.split(`${ROOT_URL}/`)[1] || "";

      if (!sessionId) {
        goBack();
      }

      const sessionRef = ref(db, sessionId);

      onValue(sessionRef, (snap) => {
        const data = snap.val();
        if (data) {
          // Check if user is one of the session's users
          if (data?.p1Id !== userId && data?.p2Id !== userId) {
            navigate(-1);
          }

          let p2Name;

          if (data.matchType === "VSAI") {
            p2Name = "Computer";
          } else if (data.p2Name) {
            p2Name = data.p2Name;
          }

          (dispatch as Dispatch<GameAction>)({
            type: "SET_PLAYER_NAMES",
            payload: {
              p1: data.p1Name,
              p2: p2Name,
            },
          });
        }
      });
    }
  }, [dispatch, location]);

  return (
    <Container>
      <Wrapper>
        <JoinGameModal isOpen={isJoining} onClose={goBack} />
        <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
        <Banner>
          <PlayerContainer>
            <TextDisplay>{p1.name}</TextDisplay>
            <TextDisplay>Score: {p1.score}</TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "center" }}>
            <TextDisplay>{gameMatch[currentPlayer].name}'s Turn</TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "right" }}>
            {!!p2.name ? (
              <TextDisplay>
                {!!p2.name ? p2.name : "Waiting for Opponent..."}
              </TextDisplay>
            ) : (
              <Button onClick={handleInviteClick}>Invite Opponent</Button>
            )}
            <TextDisplay>Score: {p2.score}</TextDisplay>
          </PlayerContainer>
        </Banner>

        {p1.name && <Board />}
      </Wrapper>
    </Container>
  );
};

export default Game;
