import Game from "./pages/Game";
import Landing from "./pages/Landing";

const App = () => {
  const pathname = window.location.pathname;

  return <div className="App">{pathname === "/" ? <Landing /> : <Game />}</div>;
};

export default App;
