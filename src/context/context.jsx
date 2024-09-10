import React, { createContext, useEffect, useState} from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [videoURL, setVideoURL] = useState(null);
  const [imgString, setImgString] = useState(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [playTime,setPlayTime] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [challengeTopic, setChallengeTopic] = useState();
  const words = ["Apple", "Tree", "House", "Car", "Dog", "Cat", "Mountain", "River", "Sun", "Moon"];

  useEffect(() => {
    if (isChallenge) {
      const id = "fd8bd6c6-c657-4d48-a7c5-ec5350c4453d";
      fetch(`http://localhost:5000/data/${id}`) 
        .then(response => response.json())
        .then(data => {
          console.log('Fetched data:', data.data.DrData);
          const reqJSON = data.data.DrData;
          setChallengeTopic(reqJSON.topic);
          setImgString(reqJSON.img);
          setVideoURL(reqJSON.vdo);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, []); 

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
        challengeTopic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
