import styled from "@emotion/styled";
import { FC, MouseEvent, useCallback, useState } from "react";
import { textPrimary } from "../../variables";
import Checkbox from "../common/Checkbox";
import Button from "../common/Button";
import StartGameModal from "../modal/StartGameModal";
import { Container } from "../styled/Container";

const StartContainer = styled(Container)`
  flex-direction: column;
  margin-top: 5rem;
  width: 30vw;
`;

const ModeContainer = styled(Container)`
  margin: 1rem 0;
  width: 95%;
  justify-content: space-between;
  color: ${textPrimary};
`;

/* TODO: 
    X Start game button
    X Mode selector
    X Start game modal
    Leaderboards
*/

const Landing: FC = () => {
  const [mode, setMode] = useState("PVP");
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
      </StartContainer>
    </Container>
  );
};

export default Landing;
