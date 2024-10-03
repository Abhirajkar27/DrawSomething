import React, { useState } from "react";
import "./App.css";
import WordSelection from "./Pages/WordSelection";
import { GameProvider } from "./context/context";
import ChallengePlaying from "./Pages/ChallengePlaying";
import Backgrounddots from "./components/Backgrounddots";
import ChallengePlayP2 from "./Pages/ChallengePlayP2";


function App() {
  const [appPage, setAppPage] = useState(null);
  let content;
  switch (appPage) {
    case "ChallengeMode":
      content = <ChallengePlaying setAppPage={setAppPage}/>;
      break;
    case "ChallengeModeP2":
      content = <ChallengePlayP2/>;
      break;
    default:
      content = <WordSelection setAppPage={setAppPage}/>; 
  }
  return (
    <div className="App_G6h5">
      <Backgrounddots/>
      <GameProvider>
        {content}
      </GameProvider>
    </div>
  );
}

export default App;
