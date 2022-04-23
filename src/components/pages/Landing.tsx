import styled from "@emotion/styled";
import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import { bgColor, textPrimary } from "../../variables";
import Checkbox from "../common/Checkbox";
import Button from "../common/Button";
import StartGameModal from "../modal/StartGameModal";
import { Container } from "../styled/Container";
import Game from "./Game";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { dataToGameList } from "../helpers/parse";

const StartContainer = styled(Container)`
  height: auto;
  flex-direction: column;
  margin-top: 5rem;
  width: 30vw;
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

const Landing: FC = () => {
  const gameCollectionRef = collection(db, "tictactoe");

  const [mode, setMode] = useState("");
  const [gameList, setGameList] = useState<any>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const handleModeClick = (param: string) => {
    setMode(param);
  };

  const handleStartClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsStartModalOpen(true);
  };

  const closeStartModal = useCallback(() => {
    setIsStartModalOpen(false);
  }, []);

  useEffect(() => {
    setMode("PVP");
    const loadGames = async () => {
      const data = await getDocs(
        query(gameCollectionRef, orderBy("date", "desc"))
      );
      setGameList(
        data.docs.map((entry) =>
          dataToGameList(entry.data(), entry.id)
        ) as Array<any>
      );
    };

    loadGames();
  }, []);

  return (
    <Container>
      <StartGameModal
        isOpen={isStartModalOpen}
        onClose={closeStartModal}
        isTwoPlayer={mode === "PVP"}
      />
      <StartContainer>
        <Button variant="filled" width="100%" onClick={handleStartClick}>
          START GAME
        </Button>
        <ModeContainer>
          <Checkbox
            label="VS Player"
            onClick={() => handleModeClick("PVP")}
            name="mode"
            value="PVP"
            checked={mode === "PVP"}
          ></Checkbox>
          <Checkbox
            label="VS Computer"
            onClick={() => handleModeClick("VSAI")}
            name="mode"
            value="VSAI"
            checked={mode === "VSAI"}
          ></Checkbox>
        </ModeContainer>

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
            <></>
          )}
        </History>
      </StartContainer>
    </Container>
  );
};

export default Landing;
