import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";

import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { PlayerScore } from "../types/types";

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
  onContinue(): void;
  gameState: any;
};

const EndGameModal: FC<Props> = ({
  isOpen,
  onClose,
  gameState: { p1Name, p2Name, p1Score, p2Score },
  onContinue,
}) => {
  const [header, setHeader] = useState("");

  const handleCloseModal = () => {
    onClose();
  };

  const handleContinue = async () => {
    onContinue();
  };

  useEffect(() => {
    let headerText = "";
    switch (true) {
      case p1Score > p2Score:
        headerText = `${p1Name} Wins!`;
        break;
      case p1Score < p2Score:
        headerText = `${p2Name} Wins!`;
        break;
      case p1Score === p2Score:
        headerText = "Draw!";
        break;
      default:
        return;
    }

    setHeader(headerText);
  }, [p1Name, p2Name, p1Score, p2Score]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
    >
      <Label>{header}</Label>
      <br />
      <br />
      <Label>
        {p1Name}: {p1Score}
      </Label>
      <br />

      <Label>
        {p2Name}: {p2Score}
      </Label>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Quit
        </Button>
        <Button variant="text" onClick={handleContinue}>
          Continue
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default EndGameModal;
