import { RefObject } from "react";
import { winningCombinations } from "../../schema";
import { CIRCLE_CLASS, X_CLASS } from "../pages/Board";
import { Player } from "../types/types";

export const emptySquares = (
  cellArr?: RefObject<Array<HTMLDivElement>>,
  cellValue?: Array<HTMLDivElement>
) => {
  const cells = !!cellArr ? cellArr.current : cellValue;

  return cells!.filter(
    (cell: HTMLDivElement) =>
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS) &&
      cell.innerHTML === ""
  );
};

export const checkWin = (
  player: Player,
  cellArr?: Array<HTMLDivElement>,
  cellValue?: any
) => {
  const cellElements = cellArr || cellValue;
  const playChar = player === "p1" ? " " : "  ";

  if (cellElements) {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return cellElements[index].innerHTML === playChar;
      });
    });
  }
};

export const minimax = (
  newCellArr: RefObject<Array<HTMLDivElement>>,
  player: Player,
  cellValue?: any
) => {
  const newCArr = newCellArr.current as Array<HTMLDivElement>;
  let availSpots = emptySquares(undefined, cellValue);

  if (checkWin("p1", newCArr, cellValue)) {
    return { score: -10 };
  } else if (checkWin("p2", newCArr, cellValue)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i += 1) {
    let move: any = {};
    newCArr[availSpots[i].id as any].innerHTML = player === "p1" ? " " : "  ";

    if (player === "p2") {
      let result = minimax(newCellArr, "p1", cellValue);
      move.score = result.score;
    } else {
      let result = minimax(newCellArr, "p2", cellValue);
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
};
