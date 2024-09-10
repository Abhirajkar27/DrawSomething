import React, { useState } from "react";
import "./App.css";
import WordSelection from "./components/WordSelection";
import { GameProvider } from "./context/context";
import ChallengePlaying from "./Pages/ChallengePlaying";

function App() {
  const [appPage, setAppPage] = useState(null);
  let content;
  switch (appPage) {
    case "ChallengeMode":
      content = <ChallengePlaying/>;
      break;
    default:
      content = <WordSelection setAppPage={setAppPage}/>; 
  }
  return (
    <div className="App_G6h5">
      <GameProvider>
        {content}
      </GameProvider>
    </div>
  );
}

export default App;
