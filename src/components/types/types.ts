export type PlayerScore = {
  name: string;
  score: number;
};

export type MatchTurns = Array<Array<number | string>>;

export type Player = "p1" | "p2";

export type GameState = {
  currentPlayer: Player;
  gameMatch: Record<Player, PlayerScore>;
  gameTurns: Array<MatchTurns>;
};

export type GameAction =
  | { type: "SET_CURRENT_PLAYER"; payload: Player }
  | { type: "SET_PLAYER_NAMES"; payload: Record<Player, string> }
  | { type: "SET_ADD_WIN" }
  | { type: "SET_GAME_TURNS"; payload: MatchTurns }
  | { type: "RESET_GAME" }
  | { type: "RESET_MATCH" };
