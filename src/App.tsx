import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import { Routes, Route, useLocation } from "react-router-dom";
import { FC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalGameState from "./components/controllers/useLocalGameState";

export const ROOT_URL = "/games-tic-tac-shuffle";

const App: FC = () => {
  const location = useLocation();
  const { resetState, setUserId } = useLocalGameState();

  useEffect(() => {
    if (location.pathname.split("/").length === 2) {
      resetState();
      const tempUserId = uuidv4();
      setUserId(tempUserId);
    }
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path={ROOT_URL} element={<Landing />}></Route>
        <Route path={`${ROOT_URL}/:gameId`} element={<Game />}></Route>
        <Route path={`${ROOT_URL}/join/:gameId`} element={<Game />}></Route>
      </Routes>
    </div>
  );
};

export default App;
