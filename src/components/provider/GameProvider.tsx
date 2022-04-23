import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { GameAction, GameState, Player } from "../types/types";

export const DEFAULT_GAME_STATE = {
  currentPlayer: "p1" as Player,
  gameMatch: { p1: { name: "", score: 0 }, p2: { name: "", score: 0 } },
  gameTurns: [],
};

const reducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "SET_CURRENT_PLAYER":
      return { ...state, currentPlayer: action.payload };
    case "RESET_MATCH":
      return { ...state, currentPlayer: "p1" as Player };
    case "SET_PLAYER_NAMES":
      return {
        ...state,
        gameMatch: {
          p1: { name: action.payload.p1, score: 0 },
          p2: { name: action.payload.p2, score: 0 },
        },
      };
    case "SET_ADD_WIN":
      return {
        ...state,
        gameMatch: {
          ...state.gameMatch,
          [state.currentPlayer]: {
            name: state.gameMatch[state.currentPlayer].name,
            score: (state.gameMatch[state.currentPlayer].score += 1),
          },
        },
      };
    case "SET_GAME_TURNS":
      return { ...state, gameTurns: [...state.gameTurns, action.payload] };
    case "RESET_GAME":
      return DEFAULT_GAME_STATE;
    default:
      return { ...state };
  }
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE as GameState);
export const GameDispatchContext = createContext(
  (() => {}) as Dispatch<GameAction>
);

const GameProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_GAME_STATE);

  // useEffect(() => {
  //   return () => {
  //     dispatch({ type: "RESET_GAME" });
  //   };
  // }, []);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export const useGame = () => {
  const useGameState = () => useContext(GameStateContext);
  const useGameDispatch = () => useContext(GameDispatchContext);
  return [useGameState(), useGameDispatch()];
};

export default GameProvider;
