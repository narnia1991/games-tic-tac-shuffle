import { onValue, ref, set } from "firebase/database";
import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROOT_URL } from "../../App";
import { db } from "../../firebase";
import { checkWin, minimax } from "../helpers/minimax";
import EndGameModal from "../modal/EndGameModal";
import EndMatchModal from "../modal/EndMatchModal";
import ShuffleClass from "../modal/ShuffleClass";
import { StyledBoard } from "../styled/StyledBoard";
import { StyledCell } from "../styled/StyledCell";
import { Player } from "../types/types";
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

  const { moves = [], currentPlayer, currentClass: playerClass } = currentRound;
  const {
    p1Name,
    p2Name,
    currentRound: roundNumber,
    matchType,
    p1Score,
    p2Score,
  } = gameState;

  const location = useLocation();
  const navigate = useNavigate();

  const uuid = location.pathname.split(`${ROOT_URL}/`)[1];
  const sessionRef = ref(db, uuid);
  const roundRef = ref(db, `${uuid}_${roundNumber}`);

  const playerType = localStorage.getItem("playerType");

  const [result, setResult] = useState("");

  const [showShuffle, setShowShuffle] = useState(false);
  const [isEndMatchModalOpen, setIsEndMatchModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

  const isVSComputer = matchType === "VSAI";
  const cellArrRef: RefObject<Array<HTMLDivElement>> = useRef([]);
  const boardRef: RefObject<HTMLDivElement> = useRef(null);

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
        set(sessionRef, {
          ...gameState,
          currentRound: roundNumber + 1,
        });
      } else {
        const isP1 = currentPlayer === "p1";
        set(sessionRef, {
          ...gameState,
          p1Score: isP1 ? p1Score + 1 : p1Score,
          p2Score: !isP1 ? p2Score + 1 : p2Score,
          currentRound: roundNumber + 1,
        });
        setResult(
          `${currentPlayer === "p1" ? p1Name : p2Name ?? "COMPUTER"} Wins!`
        );
      }
      setIsEndMatchModalOpen(true);
    },
    [currentPlayer, p1Score, p2Score, gameState, roundNumber]
  );

  const handleCellClick = useCallback(
    (i: number) => () => {
      try {
        if (
          (!!moves.length && (moves[moves.length - 1] ?? [])[i]) ||
          !p1Name ||
          (!isVSComputer && (!p2Name || currentPlayer !== playerType))
        ) {
          return;
        }

        const currentClass = playerClass[currentPlayer];
        const currentBoard = {
          ...(moves[moves.length - 1] ?? []),
          [i]: { class: currentClass, player: currentPlayer, timeLeft: 0 },
        };

        if (checkWin(currentPlayer, currentBoard, playerClass)) {
          showResult(false);
        } else if (moves.length === 8) {
          showResult(true);
        } else {
          // swap turns
          set(roundRef, {
            ...currentRound,
            currentPlayer: currentRound.currentPlayer === "p1" ? "p2" : "p1",
            moves: [...currentRound.moves, currentBoard],
          });

          if (!!(moves.length % 2)) {
            setShowShuffle(true);
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      isDraw,
      playerClass,
      currentPlayer,
      isVSComputer,
      showResult,
      moves,
      set,
      currentRound,
      matchType,
      playerType,
    ]
  );

  const bestSpot = useCallback(() => {
    if (!isEndGameModalOpen && !isEndMatchModalOpen) {
      const { index } = minimax({
        currentBoard: [...moves].pop(),
        player: "p2",
        playerClass,
      });

      handleCellClick(index as number)();
    }
  }, [isEndGameModalOpen, isEndMatchModalOpen, moves, playerClass]);

  const handleAcceptShuffle = useCallback(
    (shuffledClass: string, shuffledPlayer: string) => {
      setShowShuffle(false);

      set(roundRef, {
        ...currentRound,
        shuffleHistory: [
          ...(currentRound.shuffleHistory ?? []),
          {
            class: shuffledClass,
            player: shuffledPlayer,
          },
        ],
        currentPlayer: shuffledPlayer,
        currentClass: {
          [shuffledPlayer]: shuffledClass,
          [shuffledPlayer === "p1" ? "p2" : "p1"]:
            shuffledClass === X_CLASS ? CIRCLE_CLASS : X_CLASS,
        },
      });
    },
    [roundRef, set, currentRound]
  );

  const handleContinue = useCallback(() => {}, []);

  useEffect(() => {
    if (!!isVSComputer && currentPlayer === "p2" && !showShuffle) {
      bestSpot();
    }
  }, [bestSpot, isVSComputer, currentPlayer, showShuffle]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  useEffect(() => {
    onValue(roundRef, (snap) => {
      const data = snap.val();
      if (data) {
        setCurrentRound(data);
      }
    });

    onValue(sessionRef, (snap) => {
      const data = snap.val();
      if (data) {
        setGameState(data);
      }
    });
  }, []);

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
            className={`${(moves[moves.length - 1] ?? [])[i]?.class ?? ""} ${
              (!p1Name || (!isVSComputer && !p2Name)) && "disabled"
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
