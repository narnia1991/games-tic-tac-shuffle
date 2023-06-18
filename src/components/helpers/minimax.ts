import { winningCombinations } from "../../schema";
import { Player } from "../types/types";

export const emptySquares = (currentBoard: Record<string, string>) => {
  if (!!currentBoard) {
    const emptyCells = [];
    for (let i = 0; i < 10; i += 1) {
      if (!currentBoard[i]) {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }
  return [0, 1, 2, 3, 4, 5, 6, 7, 8];
};

export const checkWin = (
  player: Player,
  currentBoard: Record<string, string>,
  playerClass: Record<string, string>
) => {
  if (!!currentBoard) {
    if (Object.keys(currentBoard).length >= 3) {
      return winningCombinations.some((combination) => {
        return combination.every((index) => {
          return currentBoard[index] === playerClass[player];
        });
      });
    }
  }
};

export const minimax = ({ currentBoard, player, playerClass }: any) => {
  let availSpots = emptySquares(currentBoard);
  let newCArr = { ...currentBoard };

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
    newCArr[availSpots[i]] = playerClass[player];

    let result = minimax({ currentBoard: newCArr, player, playerClass });
    move.score = result.score;

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

  console.log(newCArr, availSpots, bestMove, availSpots[bestMove]);
  return {
    index: newCArr[availSpots[bestMove]],
    score: moves[bestMove].score,
  };
};
