import { FC, useCallback, useState } from "react";
import { Container } from "../styled/Container";
import Board from "./Board";
import {
  Banner,
  PlayerContainer,
  TextDisplay,
  Wrapper,
} from "../styled/StyledGame";
import { useLocation, useNavigate } from "react-router-dom";
import JoinGameModal from "../modal/JoinGameModal";
import InviteModal from "../modal/InviteModal";
import Button from "../common/Button";
import useGameController from "../controllers/useGameController";
import useMatchController from "../controllers/useMatchController";
import useLocalGameState from "../controllers/useLocalGameState";

const Game: FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { sessionId } = useLocalGameState();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    gameState: { p1Name, p1Score, p2Name, p2Score, matchType },
  } = useGameController({ sessionId });

  const {
    currentRound: { currentPlayer, currentClass },
  } = useMatchController();

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

  return (
    <Container>
      <Wrapper>
        <JoinGameModal isOpen={isJoining} onClose={goBack} />
        <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
        <Banner>
          <PlayerContainer>
            <TextDisplay>{p1Name}</TextDisplay>
            <TextDisplay>Score: {p1Score ?? 0}</TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "center" }}>
            <TextDisplay>
              {currentPlayer}'s Turn : {currentClass[currentPlayer]}
            </TextDisplay>
          </PlayerContainer>

          <PlayerContainer style={{ textAlign: "right" }}>
            {matchType === "PVP" ? (
              !!p2Name ? (
                <>
                  <TextDisplay>{p2Name}</TextDisplay>
                  <TextDisplay>Score: {p2Score ?? 0}</TextDisplay>
                </>
              ) : (
                <Button onClick={handleInviteClick}>Invite Opponent</Button>
              )
            ) : (
              <>
                <TextDisplay>COMPUTER</TextDisplay>
                <TextDisplay>Score: {p2Score ?? 0}</TextDisplay>
              </>
            )}
          </PlayerContainer>
        </Banner>

        {p1Name && <Board />}
      </Wrapper>
    </Container>
  );
};

export default Game;
