import {
  Dispatch,
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
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
import { GameAction, GameState, Player } from "../types/types";
import { getNames } from "./Game";

export const X_CLASS = "cross";
export const CIRCLE_CLASS = "circle";
const defaultPlayerClass = {
  p1: X_CLASS,
  p2: CIRCLE_CLASS,
};

const Board: FC = () => {
  const [state, dispatch] = useGame();
  const { currentPlayer, gameMatch } = state as GameState;

  const [playerClass, setPlayerClass] =
    useState<Record<string, string>>(defaultPlayerClass);
  const [moves, setMoves] = useState<Record<string, string>[]>([]);
  const [hoverClass, setHoverClass] = useState(X_CLASS);
  const [showShuffle, setShowShuffle] = useState(false);
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
  const [result, setResult] = useState("");

  const isVSComputer = !window.location.pathname.split("_")[1];
  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

  const startGame = useCallback(() => {
    (dispatch as Dispatch<GameAction>)({ type: "RESET_MATCH" });
    setHoverClass(X_CLASS);
    setPlayerClass(defaultPlayerClass);
    setMoves([]);
  }, [dispatch]);

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

  const isDraw = useMemo(
    () => !!moves.length && Object.keys([...moves].pop() ?? {}).length >= 9,
    [moves]
  );

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
    (i: number) => () => {
      try {
        if (!!moves.length && (moves[moves.length - 1] ?? [])[i]) {
          return;
        }

        const currentClass = playerClass[currentPlayer];
        const currentBoard = {
          ...(moves[moves.length - 1] ?? []),
          [i]: currentClass,
        };

        setMoves([...moves, currentBoard]);

        const pause = setTimeout(() => {
          clearTimeout(pause);
        }, 100);

        if (checkWin(currentPlayer, currentBoard, playerClass)) {
          showResult(false);
        } else if (moves.length === 8) {
          showResult(true);
        } else {
          // swap turns
          if (!!(moves.length % 2)) {
            setShowShuffle(true);
            return;
          }
          (dispatch as Dispatch<GameAction>)({
            type: "SET_CURRENT_PLAYER",
            payload: currentPlayer === "p1" ? "p2" : "p1",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      isDraw,
      playerClass,
      currentPlayer,
      dispatch,
      isVSComputer,
      showResult,
      moves,
    ]
  );

  const bestSpot = useCallback(() => {
    if (!isEndGameModalOpen && !isEndMatchModalOpen) {
      const { index } = minimax({
        currentBoard: [...moves].pop(),
        player: "p1",
        playerClass,
      });

      handleCellClick(index as number)();
    }
  }, [isEndGameModalOpen, isEndMatchModalOpen, moves, playerClass, dispatch]);

  const handleAcceptShuffle = useCallback(
    (shuffledClass: string, shuffledPlayer: string) => {
      setShowShuffle(false);
      setPlayerClass({
        [shuffledPlayer]: shuffledClass,
        [shuffledPlayer === "p1" ? "p2" : "p1"]:
          shuffledClass === X_CLASS ? CIRCLE_CLASS : X_CLASS,
      });

      (dispatch as Dispatch<GameAction>)({
        type: "SET_CURRENT_PLAYER",
        payload: shuffledPlayer as Player,
      });

      setHoverClass(shuffledClass);
    },
    [dispatch]
  );

  useEffect(() => {
    setHoverClass(playerClass[currentPlayer]);
  }, [currentPlayer, playerClass]);

  useEffect(() => {
    if (isVSComputer && currentPlayer === "p2" && !showShuffle) {
      bestSpot();
    }
  }, [bestSpot, isVSComputer, currentPlayer]);

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
