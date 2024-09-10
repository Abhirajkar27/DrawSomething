import React, { createContext, useEffect, useState} from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [videoURL, setVideoURL] = useState(null);
  const [imgString, setImgString] = useState(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [playTime,setPlayTime] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const words = ["Apple", "Tree", "House", "Car", "Dog", "Cat", "Mountain", "River", "Sun", "Moon"];

  // useEffect(()=>{
  //   console.log("IsDrawn Changed:", isDrawn);
  // },[isDrawn])

  return (
    <GameContext.Provider
      value={{
        videoURL,
        setVideoURL,
        imgString,
        setImgString,
        isDrawn,
        setIsDrawn,
        playTime,
        setPlayTime,
        selectedWord,
        setSelectedWord,
        isChallenge, 
        setIsChallenge,
        words,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
