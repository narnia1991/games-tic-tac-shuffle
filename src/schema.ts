export const winningCombinations: Array<Array<number>> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type Match = {
  turnPlayer: string;
  turns: Array<Array<string>>;
  winner: string;
};

export type Score = {
  p1: number;
  p2: number;
};

export type Game = {
  p1Name: string;
  p2Name: string;
  matchTurns: Array<Match>;
  score: Score;
};
