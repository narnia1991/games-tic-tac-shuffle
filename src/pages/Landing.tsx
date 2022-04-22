import styled from "@emotion/styled";
import { FC, MouseEvent, SyntheticEvent, useState } from "react";
import { bgColor, textPrimary } from "../colors";
import Checkbox from "../components/Checkbox";
import FilledButton from "../components/FilledButton";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: ${bgColor};
`;

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
    Start game modal
    Leaderboards
*/

const Landing: FC = () => {
  const [mode, setMode] = useState("PVP");
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const handleModeClick = (e: MouseEvent) => {
    if (e.target) {
      setMode((e.target as HTMLInputElement).value);
    }
  };

  const handleStartClick = (e: MouseEvent) => {
    e.preventDefault();
    // open start modal
  };

  return (
    <Container>
      <StartContainer>
        <FilledButton width="100%" onClick={handleStartClick}>
          START GAME
        </FilledButton>
        <ModeContainer>
          <Checkbox
            label="VS Player"
            onClick={handleModeClick}
            name="mode"
            value="PVP"
            checked={mode === "PVP"}
          ></Checkbox>
          <Checkbox
            label="VS Computer"
            onClick={handleModeClick}
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
