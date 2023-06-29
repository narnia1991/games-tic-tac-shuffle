import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import { Routes, Route } from "react-router-dom";
import { FC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const ROOT_URL = "/games-tic-tac-shuffle";

const App: FC = () => {
  useEffect(() => {
    const user = localStorage.getItem("userId");

    if (!user) {
      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
  }, []);

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
