import React from "react";
import './App.css';
import WordSelection from "./components/WordSelection";
import { GameProvider } from "./context/context";

function App() {
  return (
    <div className="App_G6h5">
    <GameProvider>
      <WordSelection/>
    </GameProvider></div>
  );
}

export default App;
