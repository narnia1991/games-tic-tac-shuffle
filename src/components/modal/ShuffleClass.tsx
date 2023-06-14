// concept from www.youtube(dot)com/watch?v=yXEcd0eGrpw

import styled from "@emotion/styled";
import { css, Keyframes, keyframes } from "@emotion/react";
import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Modal from "../common/Modal";
import { CIRCLE_CLASS, X_CLASS } from "../pages/Board";

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
  onClose(current: string): void;
};

const ShuffleClass: FC<Props> = ({ isOpen, onClose }) => {
  const tictacClassRef: MutableRefObject<string> = useRef("");

  const handleClose = useCallback(() => {
    onClose?.(tictacClassRef.current);
  }, []);

  useEffect(() => {
    const tictacShuffle = Math.floor(Math.random() * 2);
    tictacClassRef.current = tictacShuffle ? X_CLASS : CIRCLE_CLASS;
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      shouldCloseOnOverlayClick={false}
    >
      <ShuffleTitle>You are</ShuffleTitle>
      {tictacClassRef.current === X_CLASS ? (
        <TicTacContainerX>
          <TicTacX>X</TicTacX>
          <TicTacO>O</TicTacO>
        </TicTacContainerX>
      ) : tictacClassRef.current === CIRCLE_CLASS ? (
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
