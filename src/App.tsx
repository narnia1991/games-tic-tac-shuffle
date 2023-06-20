import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import GameProvider from "./components/provider/GameProvider";

export const ROOT_URL = "/games-tic-tac-shuffle";

const App = () => {
  const pathname = window.location.pathname;

  if (pathname === "/") {
    window.location.href = ROOT_URL;
    return <></>;
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
