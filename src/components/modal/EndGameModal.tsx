import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";

import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useGame } from "../provider/GameProvider";
import { GameState, PlayerScore } from "../types/types";
import { db } from "../../firebase";
import { format } from "date-fns";

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

const EndGameModal: FC<Props> = ({ isOpen, onClose }) => {
  const gameCollectionRef = collection(db, "tictactoe");

  const [header, setHeader] = useState("");
  const [state] = useGame();
  const { p1, p2 } = (state as GameState).gameMatch;

  const handleCloseModal = () => {
    onClose();
  };

  const handleSaveGame = async () => {
    try {
      let winner = "";
      switch (true) {
        case p1.score > p2.score:
          winner = p1.name;
          break;
        case p1.score < p2.score:
          winner = p2.name;
          break;
        case p1.score === p2.score:
          winner = "Draw";
          break;
        default:
          return;
      }

      await addDoc(gameCollectionRef, {
        date: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        name: `${p1.name} vs. ${p2.name}`,
        score: `${p1.score} - ${p2.score}`,
        winner,
      });
      onClose();
    } catch (err) {
      //noop
    }
  };

  useEffect(() => {
    let headerText = "";
    switch (true) {
      case p1.score > p2.score:
        headerText = `${p1.name} Wins!`;
        break;
      case p1.score < p2.score:
        headerText = `${p2.name} Wins!`;
        break;
      case p1.score === p2.score:
        headerText = "Draw!";
        break;
      default:
        return;
    }

    setHeader(headerText);
  }, [p1, p2]);

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
        {p1.name}: {p1.score}
      </Label>
      <br />

      <Label>
        {p2.name}: {p2.score}
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
