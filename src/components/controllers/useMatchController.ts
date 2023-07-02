import { onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import useGameController from "./useGameController";
import useLocalGameState from "./useLocalGameState";

export type MatchRoundType = {
  currentPlayer: string;
  currentClass: Record<string, string>;
};
export type MatchRoundMovesType = Record<string, number | string>[];
export type ShuffleHistoryType = Record<string, string>[];

const useMatchController = () => {
  const [currentRound, setCurrentRound] = useState<MatchRoundType>({
    currentPlayer: "",
    currentClass: {},
  });
  const [roundMoves, setRoundMoves] = useState<MatchRoundMovesType>([]);
  const [roundShuffle, setRoundShuffle] = useState<ShuffleHistoryType>([]);

  const { sessionId } = useLocalGameState();
  const {
    gameState: { currentRound: roundNumber },
  } = useGameController({ sessionId });

  const roundRef = ref(db, `${sessionId}_${roundNumber}`);
  const roundMovesRef = ref(db, `${sessionId}_${roundNumber}_moves`);
  const roundShuffleRef = ref(db, `${sessionId}_${roundNumber}_shuffle`);

  const saveRound = useCallback(
    (round: any) => {
      set(roundRef, {
        ...currentRound,
        ...round,
      });
    },
    [currentRound]
  );

  const saveRoundMoves = useCallback(
    (moves: any) => {
      set(roundMovesRef, [...roundMoves, moves]);
    },
    [roundMoves]
  );

  const saveRoundShuffle = useCallback(
    (shuffle: any) => {
      set(roundShuffleRef, [...roundShuffle, shuffle]);
    },
    [roundShuffle]
  );

  useEffect(() => {
    onValue(roundRef, (snap) => {
      const data = snap.val();
      if (data) {
        setCurrentRound(data);
      }
    });
  }, []);

  useEffect(() => {
    onValue(roundMovesRef, (snap) => {
      const data = snap.val();
      if (data) {
        setRoundMoves(data);
      }
    });
  }, []);

  useEffect(() => {
    onValue(roundShuffleRef, (snap) => {
      const data = snap.val();
      if (data) {
        setRoundShuffle(data);
      }
    });
  }, []);

  return {
    currentRound,
    roundMoves,
    roundShuffle,
    saveRound,
    saveRoundMoves,
    saveRoundShuffle,
  };
};
export default useMatchController;
