import styled from "@emotion/styled";
import {
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { winningCombinations } from "../../schema";
import { bgColor, textPrimary } from "../../variables";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import { DEFAULT_GAME_MATCH, PlayerScore } from "./Game";

const StyledBoard = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, auto);
  &.cross div:not(.cross):not(.circle):hover::before,
  &.cross div:not(.cross):not(.circle):hover::after,
  &.circle div:not(.cross):not(.circle):hover::before {
    background-color: lightgrey;
  }

  div.cross::before,
  div.cross::after,
  &.cross div:not(.cross):not(.circle):hover::before,
  &.cross div:not(.cross):not(.circle):hover::after {
    content: "";
    position: absolute;
    width: calc(var(--mark-size) * 0.15);
    height: var(--mark-size);
  }

  div.cross::before,
  &.cross div:not(.cross):not(.circle):hover::before {
    transform: rotate(45deg);
  }

  div.cross::after,
  &.cross div:not(.cross):not(.circle):hover::after {
    transform: rotate(-45deg);
  }

  div.circle::before,
  div.circle::after,
  &.circle div:not(.cross):not(.circle):hover::before,
  &.circle div:not(.cross):not(.circle):hover::after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }

  div.circle::before,
  &.circle div:not(.cross):not(.circle):hover::before {
    width: var(--mark-size);
    height: var(--mark-size);
  }

  div.circle::after,
  &.circle div:not(.cross):not(.circle):hover::after {
    width: calc(var(--mark-size) * 0.7);
    height: calc(var(--mark-size) * 0.7);
    background-color: ${bgColor};
  }
`;

const StyledCell = styled.div`
  width: var(--cell-size);
  height: var(--cell-size);
  border: 3px solid ${textPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  &:first-of-type,
  &:nth-of-type(2),
  &:nth-of-type(3) {
    border-top: none;
  }
  &:nth-of-type(3n + 1) {
    border-left: none;
  }
  &:nth-of-type(3n + 3) {
    border-right: none;
  }
  &:last-of-type,
  &:nth-of-type(8),
  &:nth-of-type(7) {
    border-bottom: none;
  }
  &.cross,
  &.circle {
    cursor: not-allowed;
  }
  &.cross::before,
  &.cross::after,
  &.circle::before {
    background-color: ${textPrimary};
  }
`;

type Props = {
  currentPlayer: string;
  gameMatch: Record<string, PlayerScore>;
  setGameMatch: SetStateAction<any>;
  setCurrentPlayer: SetStateAction<any>;
};

const Board: FC<Props> = ({
  currentPlayer,
  gameMatch,
  setGameMatch,
  setCurrentPlayer,
}) => {
  const X_CLASS = "cross";
  const CIRCLE_CLASS = "circle";
  let isCircleTurn = false;
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const setBoardHoverClass = () => {
    const gameBoard = document.getElementById("gameBoard");
    if (gameBoard) {
      gameBoard.classList.remove(X_CLASS);
      gameBoard.classList.remove(CIRCLE_CLASS);
      if (isCircleTurn) {
        gameBoard.classList.add(CIRCLE_CLASS);
      } else {
        gameBoard.classList.add(X_CLASS);
      }
    }
  };

  const placeMark = useCallback(
    (cell: HTMLDivElement, currentClass: string) => {
      cell.classList.add(currentClass);
    },
    []
  );

  const checkWin = useCallback((currentClass: string) => {
    const cellElements = document.querySelectorAll("[data-cell]");

    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return cellElements[index].classList.contains(currentClass);
      });
    });
  }, []);

  const isDraw = () => {
    const cellElements = document.querySelectorAll("[data-cell]");

    // @ts-expect-error iteration of iterators
    return [...cellElements].every((cell) => {
      return (
        cell.classList.contains(X_CLASS) ||
        cell.classList.contains(CIRCLE_CLASS)
      );
    });
  };

  const showResult = (draw: boolean) => {
    if (draw) {
      setResult("Draw!");
    } else {
      const newRecord = !isCircleTurn
        ? { p1: { name: gameMatch.p1.name, score: (gameMatch.p1.score += 1) } }
        : { p2: { name: gameMatch.p2.name, score: (gameMatch.p2.score += 1) } };
      setGameMatch({ ...gameMatch, newRecord });
      setResult(`${currentPlayer} Wins!`);
    }
    setIsEndMatchModalOpen(true);
  };

  const handleCellClick = (e: any) => {
    try {
      const cell = e.target;

      const currentClass = isCircleTurn ? CIRCLE_CLASS : X_CLASS;

      console.log(currentClass, e.target);
      placeMark(cell, currentClass);
      if (checkWin(currentClass)) {
        showResult(false);
      } else if (isDraw()) {
        console.log("draw");
        showResult(true);
      } else {
        //swap turns
        setCurrentPlayer(isCircleTurn ? gameMatch.p1.name : gameMatch.p2.name);
        isCircleTurn = !isCircleTurn;
        console.log("tuloy", isCircleTurn);
        setBoardHoverClass();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startGame = () => {
    isCircleTurn = false;
    const cellElements = document.querySelectorAll("[data-cell]");
    cellElements.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener("click", handleCellClick);
      cell.addEventListener("click", handleCellClick, { once: true });
    });
    setBoardHoverClass();
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleModalClose = () => {
    startGame();
    setIsEndMatchModalOpen(false);
  };

  const handleOpenEndGame = useCallback(() => {
    setIsEndGameModalOpen(true);
  }, []);

  const handleEndGameModalClose = () => {
    setGameMatch(DEFAULT_GAME_MATCH);
    startGame();
    setIsEndGameModalOpen(false);
  };

  return (
    <StyledBoard className="board" id="gameBoard">
      <EndMatchModal
        gameMatch={gameMatch}
        header={result}
        isOpen={isEndMatchModalOpen}
        onClose={handleModalClose}
        onProceed={handleOpenEndGame}
      />

      <EndGameModal
        gameMatch={gameMatch}
        isOpen={isEndGameModalOpen}
        onClose={handleEndGameModalClose}
      />
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
      <StyledCell className="cell" data-cell></StyledCell>
    </StyledBoard>
  );
};

export default Board;
