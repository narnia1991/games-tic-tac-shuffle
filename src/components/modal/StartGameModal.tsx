import styled from "@emotion/styled";
import { FC, RefObject, useCallback, useRef } from "react";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const Container = styled.div`
  display: flex;
`;

const ButtonContainer = styled(Container)`
  justify-content: flex-end;
  margin-right: 1rem;
  align-items: flex-end;
`;

const PlayerContainer = styled(Container)`
  flex-direction: column;
  height: 70%;
  padding: 3rem;
`;

const InputContainer = styled(Container)`
  align-items: center;
  margin: 1rem;
`;

const Label = styled.label`
  color: ${textPrimary};
  margin-right: 2rem;
  font-family: ${fallBackFont};
  font-size: 1.5rem;
`;

type Props = {
  isOpen: boolean;
  onClose(): void;
  isTwoPlayer: boolean;
};

const StartGameModal: FC<Props> = ({ isOpen, onClose, isTwoPlayer }) => {
  const handleCloseModal = useCallback(() => {
    onClose();
  }, []);

  const p1Ref: RefObject<HTMLInputElement> = useRef(null);
  const p2Ref: RefObject<HTMLInputElement> = useRef(null);

  const handleCreateGame = useCallback(() => {
    const player1 = p1Ref.current;
    const player2 = p2Ref.current;

    if (!player1 || (isTwoPlayer && !player2)) {
      return;
    }

    const p1Name = player1.value;

    if (player2?.value) {
      const p2Name = player2.value;
      window.location.href = `/${p1Name}_${p2Name}`;
    }

    window.location.href = `/${p1Name}`;

    onClose();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <PlayerContainer>
        <InputContainer>
          <Label>Player 1:</Label>
          <Input name="player1" forwardRef={p1Ref}></Input>
        </InputContainer>
        {isTwoPlayer && (
          <InputContainer>
            <Label>Player 2:</Label>
            <Input name="player2" forwardRef={p2Ref}></Input>
          </InputContainer>
        )}
      </PlayerContainer>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleCreateGame}>
          Create
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default StartGameModal;
