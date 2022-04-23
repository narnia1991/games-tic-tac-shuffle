import Game from "./components/pages/Game";
import Landing from "./components/pages/Landing";
import GameProvider from "./components/provider/GameProvider";

const App = () => {
  const pathname = window.location.pathname;

  return (
    <div className="App">
      {pathname === "/" ? (
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
