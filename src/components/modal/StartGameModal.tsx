import styled from "@emotion/styled";
import { onValue, ref, set } from "firebase/database";
import { FC, RefObject, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { ROOT_URL } from "../../App";
import { db } from "../../firebase";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import useGameController, { MatchType } from "../controllers/useGameController";
import useLocalGameState from "../controllers/useLocalGameState";

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
  const { userId, setPlayerType, sessionId, setSessionId } =
    useLocalGameState();

  const { saveGameState } = useGameController({ sessionId, userId });

  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const navigate = useNavigate();

  const p1Ref: RefObject<HTMLInputElement> = useRef(null);
  const roundCountRef: RefObject<HTMLInputElement> = useRef(null);

  const handleCreateGame = useCallback(() => {
    const player1 = p1Ref.current;
    const roundCount = roundCountRef.current;

    const uuid = uuidv4();
    setPlayerType("p1");
    setSessionId(uuid);

    if (!player1) {
      return;
    }

    const p1Name = player1.value;
    const rCount = Number(roundCount?.value) ?? 1;

    try {
      saveGameState({
        p1Id: userId,
        p1Name,
        rCount,
        matchType: isTwoPlayer ? MatchType.PVP : MatchType.VSAI,
        isGameEnded: false,
        currentRound: 1,
        p1Score: 0,
        p2Score: 0,
        p1Ready: true,
        p2Ready: !isTwoPlayer,
      });

      navigate(`${ROOT_URL}/${uuid}`);
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  }, [onClose, isTwoPlayer, setPlayerType, setSessionId]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <PlayerContainer>
        <InputContainer>
          <Label>Nickname:</Label>
          <Input name="player1" forwardRef={p1Ref}></Input>
        </InputContainer>
        <InputContainer>
          <Label>No of Matches:</Label>
          <Input
            name="player2"
            forwardRef={roundCountRef}
            type="number"
          ></Input>
        </InputContainer>
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
