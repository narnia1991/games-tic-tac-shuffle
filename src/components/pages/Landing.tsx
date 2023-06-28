import styled from "@emotion/styled";
import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import { bgColor, textPrimary } from "../../variables";
import Checkbox from "../common/Checkbox";
import Button from "../common/Button";
import StartGameModal from "../modal/StartGameModal";
import { Container } from "../styled/Container";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import JoinInviteModal from "../modal/JoinInviteModal";

const StartContainer = styled(Container)`
  height: auto;
  flex-direction: column;
  margin-top: 5rem;
  width: 70vw;
`;

const ModeContainer = styled(Container)`
  margin: 1rem 0;
  width: 95%;
  height: auto;
  justify-content: space-between;
  color: ${textPrimary};
`;

const History = styled(Container)`
  height: 60vh;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 3rem;
`;

const GameEntry = styled.div`
  background-color: ${textPrimary};
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 3px solid ${bgColor};
  color: ${bgColor};
  font-weight: bold;
`;

const Entry = styled.div`
  flex: 1;
  display: flex;
  text-align: left;
  padding: 1rem;
`;

const EmptyDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  width: 100%;
`;

const Landing: FC = () => {
  const [mode, setMode] = useState("");
  const [gameList, setGameList] = useState<any>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isJoinInviteModalOpen, setIsJoinInviteModalOpen] = useState(false);

  const loadGames = () => {
    const sessionRef = ref(db, "/sessions");

    onValue(sessionRef, (snap) => {
      const data = snap.val();
      if (data?.length) {
        setGameList(data ?? []);
      }
    });
  };

  const handleJoinInvite = useCallback(() => {
    setIsJoinInviteModalOpen(true);
  }, []);

  const handleCloseJoinInviteModal = useCallback(() => {
    setIsJoinInviteModalOpen(false);
  }, []);

  const handleStartClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setIsStartModalOpen(true);
    },
    [mode]
  );

  const closeStartModal = useCallback(() => {
    setIsStartModalOpen(false);
  }, []);

  const pickMode = useCallback(
    (mode: string) => () => {
      setMode(mode);
    },
    []
  );

  useEffect(() => {
    setMode("VSAI");
    loadGames();
  }, []);

  return (
    <Container>
      <StartGameModal
        isOpen={isStartModalOpen}
        onClose={closeStartModal}
        isTwoPlayer={mode === "PVP"}
      />
      <JoinInviteModal
        isOpen={isJoinInviteModalOpen}
        onClose={handleCloseJoinInviteModal}
      />
      <StartContainer>
        <Button variant="filled" width="100%" onClick={handleStartClick}>
          CREATE GAME
        </Button>

        <Button
          style={{ marginTop: "1rem" }}
          variant="filled"
          width="100%"
          onClick={handleJoinInvite}
        >
          JOIN GAME
        </Button>
        {!!mode && (
          <ModeContainer>
            <Checkbox
              label="VS Player"
              onClick={pickMode("PVP")}
              name="mode"
              value="PVP"
              checked={mode === "PVP"}
            ></Checkbox>
            <Checkbox
              label="VS Computer"
              onClick={pickMode("VSAI")}
              name="mode"
              value="VSAI"
              checked={mode === "VSAI"}
            ></Checkbox>
          </ModeContainer>
        )}

        <History>
          <GameEntry>
            <Entry>Match</Entry>
            <Entry>Score</Entry>
            <Entry>Winner</Entry>
            <Entry>Date</Entry>
          </GameEntry>
          {gameList.length ? (
            gameList.map((entry: any) => (
              <GameEntry key={`${entry.name}_${entry.date}`}>
                <Entry>{entry.name}</Entry>
                <Entry>{entry.score}</Entry>
                <Entry>{entry.winner}</Entry>
                <Entry>{entry.date}</Entry>
              </GameEntry>
            ))
          ) : (
            <EmptyDiv>No Saved Games Yet</EmptyDiv>
          )}
        </History>
      </StartContainer>
    </Container>
  );
};

export default Landing;
