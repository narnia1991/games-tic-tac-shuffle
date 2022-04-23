import {
  Dispatch,
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { winningCombinations } from "../../schema";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import { useGame } from "../provider/GameProvider";
import { StyledBoard } from "../styled/StyledBoard";
import { StyledCell } from "../styled/StyledCell";
import { GameAction, GameState } from "../types/types";
import { getNames } from "./Game";

const Board: FC = () => {
  const [state, dispatch] = useGame();
  const { currentPlayer, gameMatch } = state as GameState;

  const X_CLASS = "cross";
  const CIRCLE_CLASS = "circle";

  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

  const setBoardHoverClass = useCallback((currentClass: string) => {
    const gameBoard = boardRef.current;
    if (gameBoard) {
      gameBoard.classList.remove(X_CLASS);
      gameBoard.classList.remove(CIRCLE_CLASS);
      if (currentClass === CIRCLE_CLASS) {
        gameBoard.classList.add(X_CLASS);
      } else {
        gameBoard.classList.add(CIRCLE_CLASS);
      }
    }
  }, []);

  const placeMark = useCallback(
    (cell: HTMLDivElement, currentClass: string) => {
      cell.classList.add(currentClass);
    },
    []
  );

  const checkWin = useCallback((currentClass: string) => {
    const cellElements = cellArrRef.current;
    if (cellElements) {
      return winningCombinations.some((combination) => {
        return combination.every((index) => {
          return cellElements[index].classList.contains(currentClass);
        });
      });
    }
  }, []);

  const isDraw = () => {
    const cellElements = cellArrRef.current;

    return [...(cellElements as Array<HTMLDivElement>)].every((cell) => {
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
      (dispatch as Dispatch<GameAction>)({
        type: "SET_ADD_WIN",
      });
      setResult(`${gameMatch[currentPlayer].name} Wins!`);
    }
    setIsEndMatchModalOpen(true);
  };

  const handleCellClick = (e: any) => {
    try {
      const cell = e.target;
      const currentClass = currentPlayer === "p2" ? CIRCLE_CLASS : X_CLASS;
      placeMark(cell, currentClass);

      if (checkWin(currentClass)) {
        showResult(false);
      } else if (isDraw()) {
        showResult(true);
      } else {
        // swap turns
        (dispatch as Dispatch<GameAction>)({
          type: "SET_CURRENT_PLAYER",
          payload: currentPlayer === "p1" ? "p2" : "p1",
        });
        setBoardHoverClass(currentClass);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startGame = () => {
    (dispatch as Dispatch<GameAction>)({ type: "RESET_MATCH" });
    const cellElements = cellArrRef.current;

    if (cellElements) {
      cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
      });
    }
    setBoardHoverClass(CIRCLE_CLASS);
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
    (dispatch as Dispatch<GameAction>)({ type: "RESET_GAME" });
    getNames(dispatch as Dispatch<GameAction>);
    setIsEndGameModalOpen(false);
    startGame();
  };

  return (
    <StyledBoard className="board" ref={boardRef}>
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
      {
        Array.from(Array(9)).map((_, i) => (
          <StyledCell
            // @ts-expect-error dirty way of pushing
            ref={(element) => (cellArrRef.current[i] = element)}
            key={`${i}`}
            onClick={handleCellClick}
          ></StyledCell>
        )) as ReactNode
      }
    </StyledBoard>
  );
};

export default Board;
