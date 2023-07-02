import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

const useGameListController = () => {
  const sessionRef = ref(db, "/sessions");
  const [gameState, setGameState] = useState([]);

  useEffect(() => {
    onValue(sessionRef, (snap) => {
      const data = snap.val();
      if (data?.length) {
        setGameState(data ?? []);
      }
    });
  }, []);

  return gameState;
};

export default useGameListController;
