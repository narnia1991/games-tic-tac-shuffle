import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { PlayerScore } from "../pages/Game";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled(Container)`
  justify-content: flex-end;
  margin-right: 1rem;
  align-items: flex-end;
`;

const Label = styled.label`
  color: ${textPrimary};
  margin-right: 4rem;
  font-family: ${fallBackFont};
  font-size: 1.5rem;
`;

type Props = {
  isOpen: boolean;
  onClose(): void;
  gameMatch: Record<string, PlayerScore>;
};

const EndGameModal: FC<Props> = ({ isOpen, onClose, gameMatch }) => {
  const [header, setHeader] = useState("");

  const handleCloseModal = () => {
    onClose();
    //remove localstorage entries
  };

  const handleSaveGame = () => {
    // create DB entry here
    //remove localstorage entries
    onClose();
  };

  useEffect(() => {
    console.log(gameMatch);
    const { p1, p2 } = gameMatch;
    let headerText =
      Number(p1.score) > Number(p2.score)
        ? `${p1.name} Wins!`
        : `${p2.name} Wins!`;

    if (Number(p1.score) === Number(p2.score)) {
      headerText = "Draw!";
    }

    setHeader(headerText);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
    >
      <Label>{header}</Label>
      <Label>
        {gameMatch.p1.name}: {gameMatch.p1.score}
      </Label>
      <Label>
        {gameMatch.p2.name}: {gameMatch.p2.score}
      </Label>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Discard
        </Button>
        <Button variant="text" onClick={handleSaveGame}>
          Save
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default EndGameModal;
