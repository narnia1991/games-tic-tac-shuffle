import { useCallback, useEffect } from "react";

const useLocalGameState = () => {
  const sessionId = localStorage.getItem("sessionId") ?? "";
  const userId = localStorage.getItem("userId") ?? "";
  const playerType = localStorage.getItem("playerType") ?? "";

  const setUserId = useCallback(
    (userId: string) => {
      localStorage.setItem("userId", userId);
    },
    [localStorage]
  );

  const setSessionId = useCallback(
    (sessionId: string) => {
      localStorage.setItem("sessionId", sessionId);
    },
    [localStorage]
  );

  const setPlayerType = useCallback(
    (playerType: string) => {
      localStorage.setItem("playerType", playerType);
    },
    [localStorage]
  );

  const resetState = useCallback(() => {
    localStorage.setItem("userId", "");
    localStorage.setItem("sessionId", "");
    localStorage.setItem("playerType", "");
  }, [localStorage]);

  return {
    sessionId,
    userId,
    playerType,
    setUserId,
    setSessionId,
    setPlayerType,
    resetState,
  };
};

export default useLocalGameState;
