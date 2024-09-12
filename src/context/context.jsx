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
      const id = "0b0058fa-b80f-4ca0-b331-516c3e95be08";
      fetch(`http://localhost:5000/data/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched data:', data.data);
          const reqJSON = data.data;
          
          setChallengeTopic(reqJSON.topic);   // Set the challenge topic
          setImgString(reqJSON.img);          // Set the base64 image string
          setVideoURL(reqJSON.vdo);           // Set the video URL
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [isChallenge]);
  

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
