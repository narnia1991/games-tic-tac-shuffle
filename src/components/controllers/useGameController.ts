import { onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import useLocalGameState from "./useLocalGameState";

export enum MatchType {
  PVP = "PVP",
  VSAI = "VSAI",
}

export enum Player {
  p1 = "p1",
  p2 = "p2",
}

export interface IGameState {
  isGameEnded: boolean;
  matchType: MatchType;
  p1Id?: string;
  p1Name?: string;
  p2Id?: string;
  p2Name?: string;
  rCount: number;
  currentRound: number;
  p1Score: number;
  p2Score: number;
  p1Ready: boolean;
  p2Ready: boolean;
}

export const DEFAULT_GAME_STATE = {
  isGameEnded: false,
  matchType: "PVP" as MatchType,
  rCount: 1,
  currentRound: 1,
  p1Score: 0,
  p2Score: 0,
  p1Ready: false,
  p2Ready: false,
};

const useGameController = ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId?: string;
}) => {
  const [gameState, setGameState] = useState<IGameState>(DEFAULT_GAME_STATE);
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const saveGameState = useCallback(
    (state: Partial<IGameState>) => {
      if (!sessionId) {
      }
      const sessionRef = ref(db, sessionId);

      set(sessionRef, {
        ...gameState,
        ...state,
      });
    },
    [gameState, sessionId, ref, set, db]
  );

  useEffect(() => {
    if (sessionId) {
      const sessionRef = ref(db, sessionId);

      onValue(sessionRef, (snap) => {
        const data = snap.val();
        if (data) {
          // Check if user is one of the session's users
          if (data?.p1Id !== userId && data?.p2Id !== userId) {
            goBack();
          }

          setGameState(data);
        }
      });
    }
  }, [sessionId]);

  return { gameState, saveGameState };
};

export default useGameController;
