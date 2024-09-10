import React, { useContext, useEffect, useState } from "react";
import Paint from "../Pages/ChallengeCreation";
import "./WordSelection.css";
import { GameContext } from "../context/context";

const WordSelection = (props) => {
  const { selectedWord, setSelectedWord, isChallenge, setIsChallenge, words } =
    useContext(GameContext);

  const [isPaintVisible, setIsPaintVisible] = useState(false);

  const handleWordSelect = (word) => {
    setSelectedWord(word);
  };

  const handleStart = () => {
    if (selectedWord) {
      setIsPaintVisible(true);
    } else {
      alert("Please select a word first!");
    }
  };

  useEffect(()=>{
    if(isChallenge){
      props.setAppPage("ChallengeMode");
    }
  })

  if (isPaintVisible) {
    return <Paint selectedWord={selectedWord} />;
  }

  return (
    <div className="wordSelectionPage_G6h5">
      <div className="WSP_head_G6h5">Select a word to Start</div>
      <div className="wordList_G6h5">
        {words.map((word) => (
          <span key={word}>
            <button
              className="word_G6h5"
              onClick={() => handleWordSelect(word)}
            >
              <span>{word}</span>
            </button>
          </span>
        ))}
      </div>
      <button className="startbtn_G6h5" onClick={handleStart}>
        <span>Start</span>
      </button>
    </div>
  );
};

export default WordSelection;
