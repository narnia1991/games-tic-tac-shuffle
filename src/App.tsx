import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import GameProvider from "./components/provider/GameProvider";

export const ROOT_URL = "/tic-tac-shuffle";

const App = () => {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    return (window.location.href = ROOT_URL);
  }

  return (
    <div className="App">
      {pathname === ROOT_URL ? (
        <Landing />
      ) : (
        <GameProvider>
          <Game />
        </GameProvider>
      )}
    </div>
  );
};

export default App;
