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
import { useNavigate } from "react-router-dom";
import { ROOT_URL } from "../../App";
import { checkWin, minimax } from "../helpers/minimax";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import ShuffleClass from "../modal/ShuffleClass";
import { StyledBoard } from "../styled/StyledBoard";
import { StyledCell } from "../styled/StyledCell";
import { GameAction, GameState, Player } from "../types/types";
import { DEFAULT_GAME_STATE } from "./Game";

export const X_CLASS = "cross";
export const CIRCLE_CLASS = "circle";
const defaultPlayerClass = {
  p1: X_CLASS,
  p2: CIRCLE_CLASS,
};

type Move = {
  postition: number;
  player: string;
  class: string;
  timeLeft: string;
};

export type RoundType = {
  moves: Record<string, Move>[];
  shuffleHistory: Array<{
    player: string;
    class: string;
  }>;
  currentPlayer: Player;
  currentClass: Record<string, string>;
};

const DEFAULT_CURRENT_ROUND = {
  moves: [],
  shuffleHistory: [],
  currentPlayer: "p1" as Player,
  currentClass: defaultPlayerClass,
};

const Board: FC = () => {
  const [gameState, setGameState] =
    useState<typeof DEFAULT_GAME_STATE>(DEFAULT_GAME_STATE);
  const [currentRound, setCurrentRound] = useState<RoundType>(
    DEFAULT_CURRENT_ROUND
  );

  const { moves, currentPlayer, currentClass: playerClass } = currentRound;
  const { p1Name, p2Name, currentRound: roundNumber } = gameState;

  const playerType = localStorage.getItem("playerType");

  const [result, setResult] = useState("");

  const [showShuffle, setShowShuffle] = useState(false);
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

  const isVSComputer = gameState.matchType === "VSAI";
  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

  const navigate = useNavigate();

  const startRound = useCallback(() => {
    // setHoverClass(X_CLASS);
    // setPlayerClass(defaultPlayerClass);
  }, []);

  const handleModalClose = () => {
    startRound();
    setIsEndMatchModalOpen(false);
  };

  const handleOpenEndGame = useCallback(() => {
    setIsEndGameModalOpen(true);
  }, []);

  const handleEndGameModalClose = useCallback(() => {
    // (dispatch as Dispatch<GameAction>)({ type: "RESET_GAME" });
    // getNames(location, dispatch as Dispatch<GameAction>);
    setIsEndGameModalOpen(false);
    startRound();

    navigate(ROOT_URL);
  }, [startRound, navigate]);

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
        // (dispatch as Dispatch<GameAction>)({
        //   type: "SET_ADD_WIN",
        // });
        // setResult(`${gameMatch[currentPlayer].name} Wins!`);
      }
      // setIsEndMatchModalOpen(true);
    },
    [currentPlayer]
  );

  const handleCellClick = useCallback(
    (i: number) => () => {
      try {
        if (
          (!!moves.length && (moves[moves.length - 1] ?? [])[i]) ||
          !p1Name ||
          !p2Name ||
          currentPlayer !== playerType
        ) {
          return;
        }

        const currentClass = playerClass[currentPlayer];
        const currentBoard = {
          ...(moves[moves.length - 1] ?? []),
          [i]: currentClass,
        };

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
          // (dispatch as Dispatch<GameAction>)({
          //   type: "SET_CURRENT_PLAYER",
          //   payload: currentPlayer === "p1" ? "p2" : "p1",
          // });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isDraw, playerClass, currentPlayer, isVSComputer, showResult, moves]
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
  }, [isEndGameModalOpen, isEndMatchModalOpen, moves, playerClass]);

  const handleAcceptShuffle = useCallback(
    (shuffledClass: string, shuffledPlayer: string) => {
      setShowShuffle(false);
      // setPlayerClass({
      //   [shuffledPlayer]: shuffledClass,
      //   [shuffledPlayer === "p1" ? "p2" : "p1"]:
      //     shuffledClass === X_CLASS ? CIRCLE_CLASS : X_CLASS,
      // });

      // (dispatch as Dispatch<GameAction>)({
      //   type: "SET_CURRENT_PLAYER",
      //   payload: shuffledPlayer as Player,
      // });

      // setHoverClass(shuffledClass);
    },
    []
  );

  const handleContinue = useCallback(() => {}, []);

  useEffect(() => {
    // setHoverClass(playerClass[currentPlayer]);
  }, [currentPlayer, playerClass]);

  useEffect(() => {
    if (isVSComputer && currentPlayer === "p2" && !showShuffle) {
      bestSpot();
    }
  }, [bestSpot, isVSComputer, currentPlayer]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  useEffect(() => {}, []);

  return (
    <StyledBoard
      className={`board ${
        playerClass.p1 === X_CLASS ? X_CLASS : CIRCLE_CLASS
      } `}
      ref={boardRef}
    >
      <EndMatchModal
        header={result}
        isOpen={isEndMatchModalOpen}
        onClose={handleModalClose}
        onProceed={handleOpenEndGame}
      />

      <EndGameModal
        gameState={gameState}
        isOpen={isEndGameModalOpen}
        onClose={handleEndGameModalClose}
        onContinue={handleContinue}
      />

      {
        Array.from(Array(9)).map((_, i) => (
          <StyledCell
            className={`${(moves[moves.length - 1] ?? [])[i].class ?? ""} ${
              (!p1Name || !p2Name) && "disabled"
            }`}
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
