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
import { ROOT_URL } from "../../App";
import { winningCombinations } from "../../schema";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import { useGame } from "../provider/GameProvider";
import { StyledBoard } from "../styled/StyledBoard";
import { StyledCell } from "../styled/StyledCell";
import { GameAction, GameState, Player } from "../types/types";
import { getNames } from "./Game";

export const X_CLASS = "cross";
export const CIRCLE_CLASS = "circle";

const Board: FC = () => {
  const [state, dispatch] = useGame();

  const [playerClass, setPlayerClass] = useState({
    p1: X_CLASS,
    p2: CIRCLE_CLASS,
  });

  const { currentPlayer, gameMatch } = state as GameState;
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const isVSComputer = !window.location.pathname.split("_")[1];
  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

  /* Start AI Functions */

  const emptySquares = (cellArr?: RefObject<Array<HTMLDivElement>>) => {
    const cells = !!cellArr ? cellArr.current : cellArrRef.current;

    return cells!.filter(
      (cell: HTMLDivElement) =>
        !cell.classList.contains(X_CLASS) &&
        !cell.classList.contains(CIRCLE_CLASS) &&
        cell.innerHTML === ""
    );
  };

  const clearCells = () => {
    cellArrRef.current?.forEach((cell) => {
      if (
        !cell.classList.contains(X_CLASS) &&
        !cell.classList.contains(CIRCLE_CLASS)
      ) {
        cell.innerHTML = "";
      }
    });
  };

  const checkWin = useCallback(
    (player: Player, cellArr?: Array<HTMLDivElement>) => {
      const cellElements = cellArr || cellArrRef.current;
      const playChar = player === "p1" ? " " : "  ";

      if (cellElements) {
        return winningCombinations.some((combination) => {
          return combination.every((index) => {
            return cellElements[index].innerHTML === playChar;
          });
        });
      }
    },
    []
  );

  const minimax = useCallback(
    (newCellArr: RefObject<Array<HTMLDivElement>>, player: Player) => {
      const newCArr = newCellArr.current as Array<HTMLDivElement>;
      let availSpots = emptySquares();

      if (checkWin("p1", newCArr)) {
        return { score: -10 };
      } else if (checkWin("p2", newCArr)) {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }

      let moves = [];
      for (let i = 0; i < availSpots.length; i += 1) {
        let move: any = {};
        // @ts-expect-error html cant be index
        newCArr[availSpots[i].id].innerHTML = player === "p1" ? " " : "  ";

        if (player === "p2") {
          let result = minimax(newCellArr, "p1");
          move.score = result.score;
        } else {
          let result = minimax(newCellArr, "p2");
          move.score = result.score;
        }

        moves.push(move);
      }

      let bestMove = 0;
      if (player === "p2") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      return {
        index: newCArr[Number(availSpots[bestMove].id)],
        score: moves[bestMove].score,
      };
    },
    [checkWin]
  );

  const bestSpot = useCallback(() => {
    const timeout = setTimeout(() => {
      if (cellArrRef && !isEndGameModalOpen && !isEndMatchModalOpen) {
        minimax(cellArrRef, currentPlayer).index!.click();
        clearCells();
      }
      clearTimeout(timeout);
    }, 1000);
  }, [currentPlayer, isEndGameModalOpen, isEndMatchModalOpen, minimax]);

  /* End AI Functions */

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
    (cell: HTMLDivElement, currentClass: string, currentContent: string) => {
      cell.classList.add(currentClass);
      cell.innerHTML = currentContent;
    },
    []
  );

  const isDraw = () => {
    const cellElements = cellArrRef.current;

    if (cellElements) {
      return [...(cellElements as Array<HTMLDivElement>)].every((cell) => {
        return (
          cell.classList.contains(X_CLASS) ||
          cell.classList.contains(CIRCLE_CLASS)
        );
      });
    }
  };

  const showResult = useCallback(
    (draw: boolean) => {
      if (draw) {
        setResult("Draw!");
      } else {
        (dispatch as Dispatch<GameAction>)({
          type: "SET_ADD_WIN",
        });
        setResult(`${gameMatch[currentPlayer].name} Wins!`);
      }
      setIsEndMatchModalOpen(true);
    },
    [currentPlayer, dispatch, gameMatch]
  );

  const handleCellClick = useCallback(
    (e) => {
      try {
        const cell = e.target;

        if (
          cell.classList.contains(X_CLASS) ||
          cell.classList.contains(CIRCLE_CLASS)
        ) {
          return;
        }

        let currentClass = playerClass[currentPlayer];
        console.log(playerClass);

        const currentContent = currentPlayer === "p2" ? "  " : " ";
        placeMark(cell, currentClass, currentContent);

        const pause = setTimeout(() => {
          clearTimeout(pause);
        }, 100);

        if (checkWin(currentPlayer)) {
          showResult(false);
        } else if (isDraw()) {
          showResult(true);
        } else {
          // swap turns
          if (currentPlayer === "p2") {
            const shuffledClass =
              Math.random() >= 0.5
                ? { p1: X_CLASS, p2: CIRCLE_CLASS }
                : { p1: CIRCLE_CLASS, p2: X_CLASS };

            setPlayerClass(shuffledClass);

            currentClass = shuffledClass.p1;
          }

          (dispatch as Dispatch<GameAction>)({
            type: "SET_CURRENT_PLAYER",
            payload: currentPlayer === "p1" ? "p2" : "p1",
          });

          setBoardHoverClass(currentClass);
        }

        if (isVSComputer && currentPlayer === "p1") {
          bestSpot();
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      playerClass,
      placeMark,
      bestSpot,
      checkWin,
      currentPlayer,
      dispatch,
      isVSComputer,
      setBoardHoverClass,
      showResult,
    ]
  );

  const startGame = useCallback(() => {
    (dispatch as Dispatch<GameAction>)({ type: "RESET_MATCH" });
    const cellElements = cellArrRef.current;

    if (cellElements) {
      cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.innerHTML = "";
      });
    }
    setBoardHoverClass(CIRCLE_CLASS);
  }, [dispatch, setBoardHoverClass]);

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
    window.location.href = ROOT_URL;
  };

  const createRef = useCallback(
    (cellArr: RefObject<Array<HTMLDivElement>>, index: number) =>
      (element: HTMLDivElement) => {
        if (cellArr.current) {
          cellArr.current[index] = element;
        }
      },
    []
  );

  useEffect(() => {
    startGame();
  }, [startGame]);

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
            ref={createRef(cellArrRef, i)}
            key={`${i}`}
            id={`${i}`}
            onClick={handleCellClick}
          ></StyledCell>
        )) as ReactNode
      }
    </StyledBoard>
  );
};

export default Board;
