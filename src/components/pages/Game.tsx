import { Dispatch, FC, useCallback, useEffect, useState } from "react";
import { Container } from "../styled/Container";
import Board from "./Board";
import {
  Banner,
  PlayerContainer,
  TextDisplay,
  Wrapper,
} from "../styled/StyledGame";
import { ROOT_URL } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import JoinGameModal from "../modal/JoinGameModal";
import InviteModal from "../modal/InviteModal";
import Button from "../common/Button";

export type GameStateProps = {
  isGameEnded: boolean;
  matchType: string;
  p1Id?: string;
  p1Name?: string;
  p2Id?: string;
  p2Name?: string;
  rCount: number;
  currentRound: number;
  p1Score: number;
  p2Score: number;
  p1Ready: boolean;
  p2Ready: boolean;
};

export const DEFAULT_GAME_STATE = {
  isGameEnded: false,
  matchType: "PVP",
  p1Id: undefined,
  p1Name: undefined,
  p2Id: undefined,
  p2Name: undefined,
  rCount: 1,
  currentRound: 1,
  p1Score: 0,
  p2Score: 0,
  p1Ready: false,
  p2Ready: false,
};

const Game: FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();
  const [gameState, setGameState] =
    useState<typeof DEFAULT_GAME_STATE>(DEFAULT_GAME_STATE);

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

          setGameState(data);
        }
      });
    }
  }, [location]);

  return (
    <Container>
      <Wrapper>
        <JoinGameModal isOpen={isJoining} onClose={goBack} />
        <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
        <Banner>
          <PlayerContainer>
            <TextDisplay>{gameState.p1Name}</TextDisplay>
            <TextDisplay>Score: {gameState.p1Score ?? 0}</TextDisplay>
          </PlayerContainer>

          {/* <PlayerContainer style={{ textAlign: "center" }}>
            <TextDisplay>{gameState.currentPlayer}'s Turn</TextDisplay>
          </PlayerContainer> */}

          <PlayerContainer style={{ textAlign: "right" }}>
            {gameState.matchType === "PVP" ? (
              !!gameState.p2Name ? (
                <>
                  <TextDisplay>{gameState.p2Name}</TextDisplay>
                  <TextDisplay>Score: {gameState.p2Score ?? 0}</TextDisplay>
                </>
              ) : (
                <Button onClick={handleInviteClick}>Invite Opponent</Button>
              )
            ) : (
              <>
                <TextDisplay>COMPUTER</TextDisplay>
                <TextDisplay>Score: {gameState.p2Score ?? 0}</TextDisplay>
              </>
            )}
          </PlayerContainer>
        </Banner>

        {gameState.p1Name && <Board />}
      </Wrapper>
    </Container>
  );
};

export default Game;
