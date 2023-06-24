// concept from www.youtube(dot)com/watch?v=yXEcd0eGrpw

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FC, useCallback, useEffect, useState } from "react";

import Modal from "../common/Modal";
import { CIRCLE_CLASS, X_CLASS } from "../pages/Board";
import { Player } from "../types/types";
import { ROOT_URL } from "../../App";
import { useLocation } from "react-router-dom";

const spinX = keyframes`
  0%{
    transform: rotateX(0)
  }
  100%{
    transform: rotateX(1980deg)
  }
`;

const spinO = keyframes`
  0%{
    transform: rotateX(0)
  }
  100%{
    transform: rotateX(2160deg)
  }
`;

const TicTacX = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 3rem;
  color: burlywood;
  background-color: blanchedalmond;
  padding: 1rem;
  position: absolute;
  backface-visibility: hidden;
  transform: rotateX(180deg);
`;

const TicTacO = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 3rem;
  color: burlywood;
  background-color: blanchedalmond;
  padding: 1rem;
  position: absolute;
  backface-visibility: hidden;
`;

const TicTacContainerX = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  transform-style: preserve-3d;
  height: 6rem;
  animation: ${spinX} 1s forwards;
`;

const TicTacContainerO = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  transform-style: preserve-3d;
  height: 6rem;
  animation: ${spinO} 1s forwards;
`;

const ShuffleButton = styled.button`
  display: block;
  height: 3rem;
  width: 9rem;
  margin: 1rem auto;
  padding: 1rem;
  font-size: 1rem;
  color: burlywood;
  background-color: rgba(119, 170, 187, 0.333);
`;

const ShuffleTitle = styled.span`
  display: block;
  text-align: center;
  height: 3rem;
  margin: 1rem auto;
  padding: 1rem;
  font-size: 4rem;
  color: burlywood;
`;

type Props = {
  isOpen: boolean;
  onClose(currentClass: string, currentPlayer: Player): void;
};

const ShuffleClass: FC<Props> = ({ isOpen, onClose }) => {
  const [ticTacClass, setTicTacClass] = useState(X_CLASS);
  const [ticTacPlayer, setTicTacPlayer] = useState("p1");
  const location = useLocation();

  const p1Name = decodeURI(
    location.pathname.split(`${ROOT_URL}/`).pop()?.split("_")[0] || "Player 1"
  );
  const p2Name = decodeURI(
    location.pathname.split(`${ROOT_URL}/`).pop()?.split("_")[1] || "Computer"
  );

  const handleClose = useCallback(() => {
    onClose?.(ticTacClass, ticTacPlayer as Player);
  }, [onClose, ticTacClass, ticTacPlayer]);

  useEffect(() => {
    const tictacShuffle = Math.random();
    const playerShuffle = Math.random();
    setTicTacClass(tictacShuffle > 0.5 ? X_CLASS : CIRCLE_CLASS);
    setTicTacPlayer(playerShuffle > 0.5 ? "p1" : "p2");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      shouldCloseOnOverlayClick={false}
    >
      <ShuffleTitle>Next Turn: Shuffle!</ShuffleTitle>

      {ticTacPlayer === "p1" ? (
        <TicTacContainerX>
          <TicTacX>{p1Name}</TicTacX>
          <TicTacO>{p2Name}</TicTacO>
        </TicTacContainerX>
      ) : ticTacPlayer === "p2" ? (
        <TicTacContainerO>
          <TicTacX>{p1Name}</TicTacX>
          <TicTacO>{p2Name}</TicTacO>
        </TicTacContainerO>
      ) : (
        <></>
      )}

      {ticTacClass === X_CLASS ? (
        <TicTacContainerX>
          <TicTacX>X</TicTacX>
          <TicTacO>O</TicTacO>
        </TicTacContainerX>
      ) : ticTacClass === CIRCLE_CLASS ? (
        <TicTacContainerO>
          <TicTacX>X</TicTacX>
          <TicTacO>O</TicTacO>
        </TicTacContainerO>
      ) : (
        <></>
      )}
      <ShuffleButton onClick={handleClose}>OK</ShuffleButton>
    </Modal>
  );
};

export default ShuffleClass;
