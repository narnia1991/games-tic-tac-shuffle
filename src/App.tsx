import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import GameProvider from "./components/provider/GameProvider";
import { Routes, Route } from "react-router-dom";
import { FC } from "react";

export const ROOT_URL = "/games-tic-tac-shuffle";

const App: FC = () => {
  const pathname = window.location.pathname;

  return (
    <div className="App">
      <Routes>
        <Route path={ROOT_URL} element={<Landing />}></Route>
        <Route
          path={`${ROOT_URL}/:gameId`}
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
