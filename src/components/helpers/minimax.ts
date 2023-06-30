import { winningCombinations } from "../../schema";
import { Player } from "../types/types";

export const emptySquares = (currentBoard: Record<string, string>) =>
  !!currentBoard
    ? Array.from(Array(9))
        .map((_, i) => i)
        .filter((i) => !currentBoard[i])
    : Array.from(Array(9)).map((_, i) => i);

export const checkWin = (
  player: Player,
  currentBoard: Record<string, Record<string, string | number>>,
  playerClass: Record<string, string>
) => {
  if (!!currentBoard) {
    if (Object.keys(currentBoard).length >= 3) {
      return winningCombinations.some((combination) => {
        return combination.every((index) => {
          return currentBoard[index]?.class === playerClass[player];
        });
      });
    }
  }
};

export const minimax = ({ currentBoard, player, playerClass }: any) => {
  let availSpots = emptySquares(currentBoard);
  let newBoard = { ...currentBoard };

  if (checkWin("p1", currentBoard, playerClass)) {
    return { score: -10 };
  } else if (checkWin("p2", currentBoard, playerClass)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availSpots.length; i += 1) {
    let move: any = {};

    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = playerClass[player];

    if (player === "p1") {
      const { score } = minimax({
        currentBoard: newBoard,
        player: "p2",
        playerClass,
      });
      move.score = score;
    } else {
      const { score } = minimax({
        currentBoard: newBoard,
        player: "p1",
        playerClass,
      });

      move.score = score;
    }

    moves.push(move);
  }

  let bestMove = 0;
  if (player === "p2") {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return {
    index: availSpots[bestMove],
    score: moves[bestMove].score,
  };
};
