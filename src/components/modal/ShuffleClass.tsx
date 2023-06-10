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

const TicTacContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  height: 6rem;
  animation: ${spinO} 3s forwards;
`;

type Props = {
  isOpen: boolean;
  onClose(current: string): void;
};

const ShuffleClass: FC<Props> = ({ isOpen, onClose }) => {
  const tictacClassRef: MutableRefObject<string> = useRef("X");

  const [ticTacAnimation, setTicTacAnimation] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    onClose?.(tictacClassRef.current);
  }, []);

  useEffect(() => {
    const tictacShuffle = Math.floor(Math.random() * 2);
    tictacClassRef.current = tictacShuffle ? X_CLASS : CIRCLE_CLASS;
    const shuffleTimeout = setTimeout(() => {
      setTicTacAnimation(!!tictacShuffle);
      clearTimeout(shuffleTimeout);
    }, 100);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      shouldCloseOnOverlayClick={false}
    >
      {/* @ts-ignore */}
      <TicTacContainer style={{ "--spinVar": ticTacAnimation ? spinX : spinO }}>
        <TicTacX>X</TicTacX>
        <TicTacO>O</TicTacO>
      </TicTacContainer>
    </Modal>
  );
};

export default ShuffleClass;
