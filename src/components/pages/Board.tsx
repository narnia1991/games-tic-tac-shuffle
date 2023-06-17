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
import { checkWin, minimax } from "../helpers/minimax";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import ShuffleClass from "../modal/ShuffleClass";
import { useGame } from "../provider/GameProvider";
import { StyledBoard } from "../styled/StyledBoard";
import { StyledCell } from "../styled/StyledCell";
import { GameAction, GameState } from "../types/types";
import { getNames } from "./Game";

export const X_CLASS = "cross";
export const CIRCLE_CLASS = "circle";

const Board: FC = () => {
  const [state, dispatch] = useGame();

  const [playerClass, setPlayerClass] = useState({
    p1: X_CLASS,
    p2: CIRCLE_CLASS,
  });

  const [moves, setMoves] = useState<Record<string, string>[]>([]);
  const [hoverClass, setHoverClass] = useState(X_CLASS);
  const { currentPlayer, gameMatch } = state as GameState;
  const [showShuffle, setShowShuffle] = useState(false);
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const isVSComputer = !window.location.pathname.split("_")[1];
  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

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

  const createCellRefs = useCallback(
    (cellArr: RefObject<Array<HTMLDivElement>>, index: number) =>
      (element: HTMLDivElement) => {
        if (cellArr.current) {
          cellArr.current[index] = element;
        }
      },
    []
  );

  /* Start AI Functions */

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

  const bestSpot = useCallback(() => {
    const timeout = setTimeout(() => {
      if (cellArrRef && !isEndGameModalOpen && !isEndMatchModalOpen) {
        minimax(cellArrRef, currentPlayer, cellArrRef.current).index!.click();
        clearCells();
      }
      clearTimeout(timeout);
    });
  }, [currentPlayer, isEndGameModalOpen, isEndMatchModalOpen]);

  /* End AI Functions */

  // const setHoverClass = useCallback((currentClass: string) => {
  //   const gameBoard = boardRef.current;
  //   console.log(currentClass, "setHoverClass");
  //   if (gameBoard) {
  //     gameBoard.classList.remove(X_CLASS);
  //     gameBoard.classList.remove(CIRCLE_CLASS);
  //     if (currentClass === CIRCLE_CLASS) {
  //       gameBoard.classList.add(X_CLASS);
  //     } else {
  //       gameBoard.classList.add(CIRCLE_CLASS);
  //     }
  //   }
  // }, []);

  // const placeMark = useCallback(
  //   (cell: HTMLDivElement, currentClass: string, currentContent: string) => {
  //     cell.classList.add(currentClass);
  //     cell.innerHTML = currentContent;
  //   },
  //   []
  // );

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
    (i: number) => (e: any) => {
      try {
        // const cell = e.target;

        // Don't do anything if cell has contents
        // if (
        //   cell.classList.contains(X_CLASS) ||
        //   cell.classList.contains(CIRCLE_CLASS)
        // ) {
        //   return;
        // }
        if (!!(moves[moves.length - 1] ?? [])[i]) {
          return;
        }

        let currentClass = playerClass[currentPlayer];
        setMoves([...moves, { ...moves[moves.length - 1], [i]: currentClass }]);

        const pause = setTimeout(() => {
          clearTimeout(pause);
        }, 100);

        if (checkWin(currentPlayer, undefined, cellArrRef.current)) {
          showResult(false);
        } else if (isDraw()) {
          showResult(true);
        } else {
          (dispatch as Dispatch<GameAction>)({
            type: "SET_CURRENT_PLAYER",
            payload: currentPlayer === "p1" ? "p2" : "p1",
          });
          // swap turns
          if (currentPlayer === "p2") {
            const shuffleTimeout = setTimeout(() => {
              setShowShuffle(true);
              clearTimeout(shuffleTimeout);
            }, 1000);
            return;
          }

          setHoverClass(currentClass);
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
      bestSpot,
      currentPlayer,
      dispatch,
      isVSComputer,
      showResult,
      moves,
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
    setHoverClass(CIRCLE_CLASS);
  }, [dispatch]);

  const handleAcceptShuffle = useCallback((shuffledClass: string) => {
    setShowShuffle(false);
    setPlayerClass({
      p1: shuffledClass,
      p2: shuffledClass === X_CLASS ? X_CLASS : CIRCLE_CLASS,
    });

    setHoverClass(shuffledClass);
  }, []);

  console.log(JSON.stringify(moves));

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <StyledBoard className={`board ${hoverClass}`} ref={boardRef}>
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
            className={`${(moves[moves.length - 1] ?? [])[i] ?? ""}`}
            ref={createCellRefs(cellArrRef, i)}
            key={`${i}`}
            id={`${i}`}
            onClick={handleCellClick(i)}
          ></StyledCell>
        )) as ReactNode
      }
      <ShuffleClass isOpen={showShuffle} onClose={handleAcceptShuffle} />
    </StyledBoard>
  );
};

export default Board;
