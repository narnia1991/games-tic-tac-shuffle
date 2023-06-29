import styled from "@emotion/styled";
import { FC } from "react";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Modal from "../common/Modal";

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
  header: string;
  onProceed(): void;
};

const EndMatchModal: FC<Props> = ({ isOpen, onClose, header, onProceed }) => {
  const handleCloseModal = () => {
    onClose();
  };

  const handleEndGame = () => {
    onClose();
    onProceed();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      shouldCloseOnOverlayClick={false}
    >
      <Label>{header}</Label>

      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Another Match
        </Button>
        <Button variant="text" onClick={handleEndGame}>
          End Game
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default EndMatchModal;
